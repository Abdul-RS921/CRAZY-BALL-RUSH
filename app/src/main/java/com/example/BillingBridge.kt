package com.example

import android.app.Activity
import android.webkit.JavascriptInterface
import androidx.annotation.Keep

@Keep
class BillingBridge(
  private val activity: Activity,
  private val billingManager: BillingManager
) {
  @JavascriptInterface
  fun purchaseRemoveAds() {
    activity.runOnUiThread {
      billingManager.launchPurchaseFlow(activity)
    }
  }

  @JavascriptInterface
  fun restorePurchases() {
    activity.runOnUiThread {
      billingManager.restorePurchases()
    }
  }

  @JavascriptInterface
  fun isPremiumUser(): Boolean {
    return billingManager.isPremiumUser()
  }

  @JavascriptInterface
  fun isBillingBridgeAvailable(): Boolean {
    return true
  }
}
