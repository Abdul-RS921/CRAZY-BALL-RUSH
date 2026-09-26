package com.example

import android.app.Activity
import android.webkit.JavascriptInterface
import androidx.annotation.Keep
import org.json.JSONObject

@Keep
class AdsBridge(
  private val activity: Activity,
  private val adMobManager: AdMobManager,
  private val billingManager: BillingManager
) {
  @JavascriptInterface
  fun isAdsBridgeAvailable(): Boolean = true

  @JavascriptInterface
  fun getAdState(): String = adMobManager.getRewardedState()

  @JavascriptInterface
  fun isRewardedLoaded(): Boolean = adMobManager.isRewardedLoaded()

  @JavascriptInterface
  fun preloadRewardedAd() {
    activity.runOnUiThread {
      adMobManager.loadRewardedAd()
    }
  }

  @JavascriptInterface
  fun showRewardedAd() {
    activity.runOnUiThread {
      adMobManager.showRewardedAd(
        activity,
        onRewardEarned = { amount, type ->
          activity.runOnUiThread {
            val main = activity as? MainActivity
            val quotedType = JSONObject.quote(type)
            main?.sendToWebDirect(
              "window.AdService && window.AdService.handleReward($amount, $quotedType); " +
              "window.onRewardedAdSuccess && window.onRewardedAdSuccess($amount, $quotedType);"
            )
          }
        },
        onDismissed = {
          activity.runOnUiThread {
            val main = activity as? MainActivity
            main?.sendToWebDirect(
              "window.AdService && window.AdService.handleAdClosed(true); " +
              "window.onRewardedAdDismissed && window.onRewardedAdDismissed();"
            )
          }
        },
        onFailed = { error ->
          activity.runOnUiThread {
            val main = activity as? MainActivity
            val quoted = JSONObject.quote(error)
            main?.sendToWebDirect(
              "window.AdService && window.AdService.handleAdFailed($quoted); " +
              "window.onRewardedAdFailed && window.onRewardedAdFailed($quoted);"
            )
          }
        },
        onStarted = {
          activity.runOnUiThread {
            val main = activity as? MainActivity
            main?.sendToWebDirect(
              "window.AnalyticsService && window.AnalyticsService.track('rewarded_ad_started');"
            )
          }
        }
      )
    }
  }

  @JavascriptInterface
  fun showInterstitial() {
    activity.runOnUiThread {
      val isPremium = billingManager.isPremiumUser()
      adMobManager.showInterstitial(activity, isPremium) {
        activity.runOnUiThread {
          val main = activity as? MainActivity
          main?.sendToWebDirect(
            "window.AdService && window.AdService.handleInterstitialClosed(); " +
            "window.onInterstitialClosed && window.onInterstitialClosed();"
          )
        }
      }
    }
  }
}
