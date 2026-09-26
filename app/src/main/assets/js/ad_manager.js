// Crazy Ball Rush - Production AdService & In-App Purchase Architecture
(function() {
  'use strict';

  // =========================================================================
  // 1. AD STATES SPECIFICATION
  // =========================================================================
  const AD_STATES = Object.freeze({
    NOT_READY: 'AD_NOT_READY',
    LOADING: 'AD_LOADING',
    READY: 'AD_READY',
    SHOWING: 'AD_SHOWING',
    REWARDED: 'AD_REWARDED',
    FAILED: 'AD_FAILED',
    CLOSED: 'AD_CLOSED'
  });

  // =========================================================================
  // 2. ANALYTICS / EVENT HOOKS
  // =========================================================================
  class AnalyticsService {
    constructor() {
      this.listeners = [];
    }

    track(eventName, data = {}) {
      try {
        console.log(`[CrazyBallRush Analytics] ${eventName}`, data);
        this.listeners.forEach(fn => {
          try { fn(eventName, data); } catch (_) {}
        });
      } catch (err) {
        console.warn('[AnalyticsService] track error:', err);
      }
    }

    addListener(fn) {
      if (typeof fn === 'function') {
        this.listeners.push(fn);
      }
    }
  }

  const analytics = new AnalyticsService();

  // =========================================================================
  // 3. IN-APP BILLING / REMOVE ADS ARCHITECTURE (Google Play Billing)
  // =========================================================================
  class BillingService {
    constructor() {
      this.productIdRemoveAds = 'remove_ads';
      this.isPremium = false;
      this.loadCachedState();
      this.initBillingListeners();
    }

    loadCachedState() {
      try {
        if (window.AndroidBillingBridge && typeof window.AndroidBillingBridge.isPremiumUser === 'function') {
          this.isPremium = !!window.AndroidBillingBridge.isPremiumUser();
        } else {
          this.isPremium = (localStorage.getItem('crazyballrush_premium_verified') === 'true') ||
                           (localStorage.getItem('escaperun_premium_verified') === 'true');
        }
      } catch (e) {
        this.isPremium = false;
      }
    }

    initBillingListeners() {
      window.onPremiumStatusUpdated = (isPremium) => {
        this.isPremium = !!isPremium;
        try {
          if (this.isPremium) {
            localStorage.setItem('crazyballrush_premium_verified', 'true');
          } else {
            localStorage.removeItem('crazyballrush_premium_verified');
            localStorage.removeItem('escaperun_premium_verified');
          }
        } catch (_) {}
        const game = window.crazyBallRushGame || window.escapeRunGame;
        if (game && typeof game.updateUI === 'function') {
          game.updateUI();
        }
      };

      window.onPurchaseSuccess = () => {
        this.isPremium = true;
        try {
          localStorage.setItem('crazyballrush_premium_verified', 'true');
        } catch (_) {}
        if (window.soundEngine && typeof window.soundEngine.playAchievement === 'function') {
          window.soundEngine.playAchievement();
        }
        if (this.currentPurchaseCallbacks && typeof this.currentPurchaseCallbacks.onSuccess === 'function') {
          this.currentPurchaseCallbacks.onSuccess();
        }
        const game = window.crazyBallRushGame || window.escapeRunGame;
        if (game && typeof game.updateUI === 'function') {
          game.updateUI();
        }
      };

      window.onPurchaseCancel = () => {
        if (this.currentPurchaseCallbacks && typeof this.currentPurchaseCallbacks.onCancel === 'function') {
          this.currentPurchaseCallbacks.onCancel();
        }
      };

      window.onPurchaseError = (errorMsg) => {
        if (this.currentPurchaseCallbacks && typeof this.currentPurchaseCallbacks.onError === 'function') {
          this.currentPurchaseCallbacks.onError(errorMsg || 'Purchase could not be completed.');
        }
      };

      window.onPurchaseRestored = (restored) => {
        if (restored) {
          this.isPremium = true;
          try {
            localStorage.setItem('crazyballrush_premium_verified', 'true');
          } catch (_) {}
          if (this.currentRestoreCallbacks && typeof this.currentRestoreCallbacks.onSuccess === 'function') {
            this.currentRestoreCallbacks.onSuccess();
          }
        } else {
          if (this.currentRestoreCallbacks && typeof this.currentRestoreCallbacks.onNoneFound === 'function') {
            this.currentRestoreCallbacks.onNoneFound();
          }
        }
        const game = window.crazyBallRushGame || window.escapeRunGame;
        if (game && typeof game.updateUI === 'function') {
          game.updateUI();
        }
      };
    }

    isPremiumUser() {
      if (window.AndroidBillingBridge && typeof window.AndroidBillingBridge.isPremiumUser === 'function') {
        return !!window.AndroidBillingBridge.isPremiumUser();
      }
      return this.isPremium;
    }

    purchaseRemoveAds(callbacks = {}) {
      this.currentPurchaseCallbacks = callbacks;
      const { onStart, onSuccess, onError } = callbacks;

      if (this.isPremiumUser()) {
        if (onSuccess) onSuccess();
        return;
      }

      if (window.AndroidBillingBridge && typeof window.AndroidBillingBridge.purchaseRemoveAds === 'function') {
        if (onStart) onStart();
        try {
          window.AndroidBillingBridge.purchaseRemoveAds();
          return;
        } catch (e) {
          console.warn('[BillingService] Launch error:', e);
          if (onError) onError('Google Play Billing connection error.');
          return;
        }
      }

      // DO NOT FAKE PURCHASE!
      // Provide truthful notification that real Google Play Billing is active in Android release
      if (onError) {
        onError("Google Play Billing is required for Remove Ads. Active in the official Android build with Google Play Store.");
      }
    }

    restorePurchases(callbacks = {}) {
      this.currentRestoreCallbacks = callbacks;
      const { onSuccess, onNoneFound } = callbacks;

      if (window.AndroidBillingBridge && typeof window.AndroidBillingBridge.restorePurchases === 'function') {
        try {
          window.AndroidBillingBridge.restorePurchases();
          return;
        } catch (e) {
          console.warn('[BillingService] Restore error:', e);
        }
      }

      this.loadCachedState();
      if (this.isPremium) {
        if (onSuccess) onSuccess();
      } else {
        if (onNoneFound) onNoneFound();
      }
    }
  }

  const billingService = new BillingService();

  // =========================================================================
  // 4. PRODUCTION ADSERVICE ABSTRACTION
  // =========================================================================
  class AdService {
    constructor(billing, analyticsTracker) {
      this.billing = billing;
      this.analytics = analyticsTracker;
      this.state = AD_STATES.NOT_READY;
      this.lastErrorMessage = null;
      this.currentRewardedCallbacks = null;
      this.pendingInterstitialCallback = null;
      this.rewardGrantedForCurrentAd = false;
      this.loadAttemptTimeout = null;

      this.initialize();
    }

    initialize() {
      // Connect callbacks exposed to native Android layer
      window.onAdStateChanged = (stateName, errorMsg) => {
        this.updateState(stateName, errorMsg);
      };

      // Native AdMob bridge callbacks
      window.onRewardedAdSuccess = (amount, type) => {
        this.handleReward(amount, type);
      };

      window.onRewardedAdDismissed = () => {
        this.handleAdClosed(true);
      };

      window.onRewardedAdFailed = (errorMsg) => {
        this.handleAdFailed(errorMsg);
      };

      window.onRewardedAdAvailability = (available) => {
        if (available) {
          this.updateState(AD_STATES.READY);
          this.analytics.track('rewarded_ad_loaded');
        } else if (this.state === AD_STATES.READY) {
          this.updateState(AD_STATES.NOT_READY);
        }
      };

      window.onInterstitialClosed = () => {
        this.handleInterstitialClosed();
      };

      // Check environment
      if (this.isNativeBridgeAvailable()) {
        console.log('[AdService] Real Android Google Mobile Ads (AdMob) bridge detected.');
        this.preloadRewardedAd();
      } else {
        console.log('[AdService] Browser environment detected. Real AdMob requires native Android build.');
        this.updateState(AD_STATES.NOT_READY);
      }
    }

    isNativeBridgeAvailable() {
      return typeof window.AndroidAdsBridge !== 'undefined' &&
             typeof window.AndroidAdsBridge.showRewardedAd === 'function';
    }

    updateState(newState, errorMsg = null) {
      this.state = newState;
      if (errorMsg) this.lastErrorMessage = errorMsg;

      const game = window.crazyBallRushGame || window.escapeRunGame;
      if (game && typeof game.onAdStateChanged === 'function') {
        game.onAdStateChanged(newState, errorMsg);
      }
    }

    preloadRewardedAd() {
      if (this.billing.isPremiumUser()) {
        return;
      }

      if (!this.isNativeBridgeAvailable()) {
        this.updateState(AD_STATES.NOT_READY);
        return;
      }

      if (this.state === AD_STATES.LOADING || this.state === AD_STATES.SHOWING) {
        return;
      }

      if (typeof window.AndroidAdsBridge.isRewardedLoaded === 'function' &&
          window.AndroidAdsBridge.isRewardedLoaded()) {
        this.updateState(AD_STATES.READY);
        return;
      }

      this.updateState(AD_STATES.LOADING);
      try {
        if (typeof window.AndroidAdsBridge.preloadRewardedAd === 'function') {
          window.AndroidAdsBridge.preloadRewardedAd();
        }
      } catch (err) {
        console.warn('[AdService] preloadRewardedAd error:', err);
        this.updateState(AD_STATES.FAILED, err.message);
      }
    }

    isRewardedAdReady() {
      if (this.billing.isPremiumUser()) {
        return true;
      }

      if (this.isNativeBridgeAvailable()) {
        if (typeof window.AndroidAdsBridge.isRewardedLoaded === 'function') {
          const loaded = !!window.AndroidAdsBridge.isRewardedLoaded();
          if (loaded && this.state !== AD_STATES.READY && this.state !== AD_STATES.SHOWING) {
            this.state = AD_STATES.READY;
          }
          return loaded;
        }
      }

      return this.state === AD_STATES.READY;
    }

    showRewardedAd(callbacks = {}) {
      this.currentRewardedCallbacks = callbacks;
      this.rewardGrantedForCurrentAd = false;
      const { onReward, onDismiss, onAdFailed, onAdStarted } = callbacks;

      this.analytics.track('rewarded_ad_requested', {
        state: this.state,
        hasBridge: this.isNativeBridgeAvailable()
      });

      // Premium User: Instant free revive without ads
      if (this.billing.isPremiumUser()) {
        this.rewardGrantedForCurrentAd = true;
        this.analytics.track('rewarded_ad_rewarded', { type: 'premium_revive', amount: 1 });
        if (onReward) onReward(1, 'premium');
        return;
      }

      // Check for real native Android bridge
      if (!this.isNativeBridgeAvailable()) {
        // Browser environment: DO NOT SIMULATE OR FAKE ADS!
        this.updateState(AD_STATES.FAILED, 'Rewarded ads require the native Android build with Google Mobile Ads (AdMob).');
        this.analytics.track('rewarded_ad_failed', { reason: 'native_bridge_unavailable' });
        if (onAdFailed) {
          onAdFailed("Ad isn't available right now. Please try again.");
        }
        return;
      }

      // Ad must be ready before presentation
      if (!this.isRewardedAdReady()) {
        this.preloadRewardedAd();
        this.updateState(AD_STATES.NOT_READY);
        this.analytics.track('rewarded_ad_failed', { reason: 'ad_not_ready' });
        if (onAdFailed) {
          onAdFailed("Ad isn't available right now. Please try again.");
        }
        return;
      }

      // Present the real AdMob Rewarded Ad
      this.updateState(AD_STATES.SHOWING);
      this.analytics.track('rewarded_ad_started');
      if (onAdStarted) onAdStarted();

      try {
        window.AndroidAdsBridge.showRewardedAd();
      } catch (err) {
        console.error('[AdService] Failed to show rewarded ad via native bridge:', err);
        this.handleAdFailed(err.message || 'Error presenting rewarded ad.');
      }
    }

    /**
     * Called ONLY when the verified ad completion reward event occurs.
     */
    handleReward(amount, type) {
      this.rewardGrantedForCurrentAd = true;
      this.updateState(AD_STATES.REWARDED);
      this.analytics.track('rewarded_ad_rewarded', { amount, type });

      if (this.currentRewardedCallbacks && typeof this.currentRewardedCallbacks.onReward === 'function') {
        this.currentRewardedCallbacks.onReward(amount, type);
      }
    }

    handleAdClosed(userDismissedEarly = false) {
      this.updateState(AD_STATES.CLOSED);

      if (!this.rewardGrantedForCurrentAd) {
        if (this.currentRewardedCallbacks && typeof this.currentRewardedCallbacks.onDismiss === 'function') {
          this.currentRewardedCallbacks.onDismiss(userDismissedEarly);
        }
      }

      this.rewardGrantedForCurrentAd = false;
      this.currentRewardedCallbacks = null;

      // Automatically preload next rewarded ad in background
      this.preloadRewardedAd();
    }

    handleAdFailed(errorMsg) {
      this.updateState(AD_STATES.FAILED, errorMsg);
      this.analytics.track('rewarded_ad_failed', { error: errorMsg });

      if (this.currentRewardedCallbacks && typeof this.currentRewardedCallbacks.onAdFailed === 'function') {
        this.currentRewardedCallbacks.onAdFailed(errorMsg || "Ad isn't available right now. Please try again.");
      }

      this.rewardGrantedForCurrentAd = false;
      this.currentRewardedCallbacks = null;

      // Schedule background preload retry
      if (this.loadAttemptTimeout) clearTimeout(this.loadAttemptTimeout);
      this.loadAttemptTimeout = setTimeout(() => this.preloadRewardedAd(), 10000);
    }

    showInterstitial(onComplete) {
      if (this.billing.isPremiumUser()) {
        if (onComplete) onComplete();
        return;
      }

      if (this.isNativeBridgeAvailable() && typeof window.AndroidAdsBridge.showInterstitial === 'function') {
        this.pendingInterstitialCallback = onComplete;
        try {
          window.AndroidAdsBridge.showInterstitial();
          return;
        } catch (e) {
          console.warn('[AdService] showInterstitial failed:', e);
          if (onComplete) onComplete();
          return;
        }
      }

      if (onComplete) onComplete();
    }

    handleInterstitialClosed() {
      if (typeof this.pendingInterstitialCallback === 'function') {
        const cb = this.pendingInterstitialCallback;
        this.pendingInterstitialCallback = null;
        cb();
      }
    }
  }

  const adService = new AdService(billingService, analytics);

  // Global namespace exports
  window.AD_STATES = AD_STATES;
  window.AnalyticsService = analytics;
  window.BillingService = billingService;
  window.AdService = adService;

  // Backward compatibility pointers
  window.adManager = adService;
  window.purchaseManager = billingService;
})();
