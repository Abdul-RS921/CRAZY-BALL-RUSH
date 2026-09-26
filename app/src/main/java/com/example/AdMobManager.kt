package com.example

import android.app.Activity
import android.content.Context
import android.util.Log
import com.google.android.gms.ads.AdError
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.FullScreenContentCallback
import com.google.android.gms.ads.LoadAdError
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.interstitial.InterstitialAd
import com.google.android.gms.ads.interstitial.InterstitialAdLoadCallback
import com.google.android.gms.ads.rewarded.RewardedAd
import com.google.android.gms.ads.rewarded.RewardedAdLoadCallback
import org.json.JSONObject

/**
 * AdMobManager handles Google Mobile Ads SDK initialization, ad preloading,
 * rewarded video lifecycle states, and interstitial delivery.
 */
class AdMobManager(
  private val context: Context,
  private val onWebCallback: (String) -> Unit
) {
  private val tag = "AdMobManager"

  // Rewarded Ad States matching the specification:
  // AD_NOT_READY, AD_LOADING, AD_READY, AD_SHOWING, AD_REWARDED, AD_FAILED, AD_CLOSED
  private var rewardedState: String = "AD_NOT_READY"
  private var rewardedAd: RewardedAd? = null
  private var isRewardedLoading = false
  private var lastRewardedLoadFailTime = 0L
  private val minLoadRetryIntervalMs = 10_000L // 10s cooldown to prevent tight loop ad spam

  // Interstitial Ad Management
  private var interstitialAd: InterstitialAd? = null
  private var isInterstitialLoading = false
  private var lastInterstitialShowTime = 0L
  private val minInterstitialIntervalMs = 25_000L

  init {
    try {
      MobileAds.initialize(context) { status ->
        Log.d(tag, "Google Mobile Ads initialized successfully: $status")
        loadInterstitial()
        loadRewardedAd()
      }
    } catch (e: Exception) {
      Log.e(tag, "Failed to initialize MobileAds SDK", e)
      rewardedState = "AD_FAILED"
    }
  }

  fun getRewardedState(): String {
    return if (rewardedAd != null) "AD_READY" else rewardedState
  }

  fun isRewardedLoaded(): Boolean {
    return rewardedAd != null
  }

  /**
   * Preloads the rewarded ad in background. Rate-limited to prevent network loops.
   */
  fun loadRewardedAd() {
    if (rewardedAd != null) {
      rewardedState = "AD_READY"
      return
    }
    if (isRewardedLoading) return

    val now = System.currentTimeMillis()
    if (now - lastRewardedLoadFailTime < minLoadRetryIntervalMs) {
      Log.d(tag, "Rewarded load on cooldown (${now - lastRewardedLoadFailTime}ms), waiting...")
      return
    }

    isRewardedLoading = true
    rewardedState = "AD_LOADING"
    onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_LOADING');")

    val adUnitId = AdConfig.getRewardedAdUnitId(context)
    val adRequest = AdRequest.Builder().build()

    RewardedAd.load(
      context,
      adUnitId,
      adRequest,
      object : RewardedAdLoadCallback() {
        override fun onAdLoaded(ad: RewardedAd) {
          Log.d(tag, "Real Rewarded Ad loaded successfully: $adUnitId")
          rewardedAd = ad
          isRewardedLoading = false
          rewardedState = "AD_READY"
          onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_READY');")
          onWebCallback("window.onRewardedAdAvailability && window.onRewardedAdAvailability(true);")
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
          Log.w(tag, "Rewarded ad failed to load: ${loadAdError.message} (code: ${loadAdError.code})")
          rewardedAd = null
          isRewardedLoading = false
          lastRewardedLoadFailTime = System.currentTimeMillis()
          rewardedState = "AD_FAILED"
          val quoted = JSONObject.quote(loadAdError.message)
          onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_FAILED', $quoted);")
          onWebCallback("window.onRewardedAdAvailability && window.onRewardedAdAvailability(false);")
        }
      }
    )
  }

  /**
   * Shows the preloaded rewarded ad.
   * Reward is ONLY granted when the onUserEarnedReward callback triggers from Google Mobile Ads.
   */
  fun showRewardedAd(
    activity: Activity,
    onRewardEarned: (Int, String) -> Unit,
    onDismissed: () -> Unit,
    onFailed: (String) -> Unit,
    onStarted: () -> Unit = {}
  ) {
    val ad = rewardedAd
    if (ad != null) {
      var rewardGranted = false
      rewardedState = "AD_SHOWING"
      onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_SHOWING');")

      ad.fullScreenContentCallback = object : FullScreenContentCallback() {
        override fun onAdShowedFullScreenContent() {
          Log.d(tag, "Real Rewarded ad presentation started")
          onStarted()
        }

        override fun onAdDismissedFullScreenContent() {
          Log.d(tag, "Rewarded ad dismissed by user")
          rewardedAd = null
          rewardedState = "AD_CLOSED"
          onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_CLOSED');")

          // Preload next rewarded ad in background
          loadRewardedAd()

          if (!rewardGranted) {
            onDismissed()
          }
        }

        override fun onAdFailedToShowFullScreenContent(adError: AdError) {
          Log.w(tag, "Rewarded ad failed to display: ${adError.message} (code: ${adError.code})")
          rewardedAd = null
          rewardedState = "AD_FAILED"
          val quoted = JSONObject.quote(adError.message)
          onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_FAILED', $quoted);")

          // Preload next
          loadRewardedAd()

          onFailed(adError.message)
        }
      }

      ad.show(activity) { rewardItem ->
        rewardGranted = true
        rewardedState = "AD_REWARDED"
        Log.d(tag, "Verified AdMob Reward Earned: ${rewardItem.amount} ${rewardItem.type}")
        onWebCallback("window.onAdStateChanged && window.onAdStateChanged('AD_REWARDED');")
        onRewardEarned(rewardItem.amount, rewardItem.type)
      }
    } else {
      Log.w(tag, "Attempted to show rewarded ad when not ready")
      rewardedState = "AD_NOT_READY"
      loadRewardedAd()
      onFailed("Ad isn't available right now. Please try again.")
    }
  }

  fun loadInterstitial() {
    if (interstitialAd != null || isInterstitialLoading) return
    isInterstitialLoading = true

    val adUnitId = AdConfig.getInterstitialAdUnitId(context)
    val adRequest = AdRequest.Builder().build()

    InterstitialAd.load(
      context,
      adUnitId,
      adRequest,
      object : InterstitialAdLoadCallback() {
        override fun onAdLoaded(ad: InterstitialAd) {
          Log.d(tag, "Interstitial ad loaded successfully")
          interstitialAd = ad
          isInterstitialLoading = false
        }

        override fun onAdFailedToLoad(loadAdError: LoadAdError) {
          Log.w(tag, "Interstitial ad failed to load: ${loadAdError.message}")
          interstitialAd = null
          isInterstitialLoading = false
        }
      }
    )
  }

  fun showInterstitial(activity: Activity, isPremium: Boolean, onDismiss: () -> Unit) {
    if (isPremium) {
      Log.d(tag, "User is Premium. Skipping interstitial ad.")
      onDismiss()
      return
    }

    val now = System.currentTimeMillis()
    if (now - lastInterstitialShowTime < minInterstitialIntervalMs) {
      Log.d(tag, "Interstitial cooldown active. Skipping ad for smooth game flow.")
      onDismiss()
      return
    }

    val ad = interstitialAd
    if (ad != null) {
      ad.fullScreenContentCallback = object : FullScreenContentCallback() {
        override fun onAdDismissedFullScreenContent() {
          Log.d(tag, "Interstitial dismissed")
          interstitialAd = null
          lastInterstitialShowTime = System.currentTimeMillis()
          loadInterstitial()
          onDismiss()
        }

        override fun onAdFailedToShowFullScreenContent(adError: AdError) {
          Log.w(tag, "Interstitial failed to show: ${adError.message}")
          interstitialAd = null
          loadInterstitial()
          onDismiss()
        }

        override fun onAdShowedFullScreenContent() {
          Log.d(tag, "Interstitial displayed on screen")
          lastInterstitialShowTime = System.currentTimeMillis()
        }
      }
      ad.show(activity)
    } else {
      Log.d(tag, "Interstitial not ready yet. Continuing without blocking user.")
      loadInterstitial()
      onDismiss()
    }
  }
}
