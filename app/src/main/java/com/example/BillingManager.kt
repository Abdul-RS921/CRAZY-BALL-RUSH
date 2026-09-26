package com.example

import android.app.Activity
import android.content.Context
import android.util.Log
import com.android.billingclient.api.AcknowledgePurchaseParams
import com.android.billingclient.api.BillingClient
import com.android.billingclient.api.BillingClientStateListener
import com.android.billingclient.api.BillingFlowParams
import com.android.billingclient.api.BillingResult
import com.android.billingclient.api.PendingPurchasesParams
import com.android.billingclient.api.Purchase
import com.android.billingclient.api.PurchasesUpdatedListener
import com.android.billingclient.api.QueryProductDetailsParams
import com.android.billingclient.api.QueryPurchasesParams

class BillingManager(
  private val context: Context,
  private val onPremiumStatusChanged: (Boolean) -> Unit,
  private val onWebCallback: (String) -> Unit
) : PurchasesUpdatedListener {

  private val tag = "BillingManager"
  private val prefs = context.getSharedPreferences("crazyballrush_billing_prefs", Context.MODE_PRIVATE)
  private val legacyPrefs = context.getSharedPreferences("escaperun_billing_prefs", Context.MODE_PRIVATE)
  private val keyIsPremium = "key_is_premium"

  val productIdRemoveAds = "remove_ads"

  private val pendingPurchasesParams = PendingPurchasesParams.newBuilder()
    .enableOneTimeProducts()
    .build()

  private var billingClient: BillingClient = BillingClient.newBuilder(context)
    .setListener(this)
    .enablePendingPurchases(pendingPurchasesParams)
    .build()

  private var isConnected = false
  private var isPremium = prefs.getBoolean(keyIsPremium, legacyPrefs.getBoolean(keyIsPremium, false))

  init {
    if (!prefs.contains(keyIsPremium) && legacyPrefs.contains(keyIsPremium)) {
      prefs.edit().putBoolean(keyIsPremium, isPremium).apply()
    }
    startConnection()
  }

  fun isPremiumUser(): Boolean = isPremium

  fun startConnection() {
    billingClient.startConnection(object : BillingClientStateListener {
      override fun onBillingSetupFinished(billingResult: BillingResult) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
          Log.d(tag, "Google Play Billing client connected successfully")
          isConnected = true
          queryExistingPurchases()
        } else {
          Log.w(tag, "Billing setup finished with code: ${billingResult.responseCode} - ${billingResult.debugMessage}")
          isConnected = false
        }
      }

      override fun onBillingServiceDisconnected() {
        Log.w(tag, "Billing service disconnected, will reconnect on next purchase attempt")
        isConnected = false
      }
    })
  }

  fun queryExistingPurchases() {
    if (!isConnected) {
      startConnection()
      return
    }

    val params = QueryPurchasesParams.newBuilder()
      .setProductType(BillingClient.ProductType.INAPP)
      .build()

    billingClient.queryPurchasesAsync(params) { billingResult, purchasesList ->
      if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
        var foundPremium = false
        for (purchase in purchasesList) {
          if (purchase.products.contains(productIdRemoveAds) || purchase.products.contains("premium")) {
            if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
              foundPremium = true
              if (!purchase.isAcknowledged) {
                acknowledgePurchase(purchase)
              }
            }
          }
        }
        setPremiumEntitlement(foundPremium)
      } else {
        Log.w(tag, "queryPurchases failed: ${billingResult.debugMessage}")
      }
    }
  }

  override fun onPurchasesUpdated(billingResult: BillingResult, purchases: MutableList<Purchase>?) {
    when (billingResult.responseCode) {
      BillingClient.BillingResponseCode.OK -> {
        if (!purchases.isNullOrEmpty()) {
          for (purchase in purchases) {
            handlePurchase(purchase)
          }
        }
      }
      BillingClient.BillingResponseCode.USER_CANCELED -> {
        Log.d(tag, "User canceled billing flow")
        onWebCallback("window.onPurchaseCancel && window.onPurchaseCancel();")
      }
      else -> {
        Log.e(tag, "Purchase failed: ${billingResult.debugMessage} (code ${billingResult.responseCode})")
        val errorMsg = org.json.JSONObject.quote(billingResult.debugMessage.ifBlank { "Billing error ${billingResult.responseCode}" })
        onWebCallback("window.onPurchaseError && window.onPurchaseError($errorMsg);")
      }
    }
  }

  private fun handlePurchase(purchase: Purchase) {
    if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
      if (purchase.products.contains(productIdRemoveAds) || purchase.products.contains("premium")) {
        setPremiumEntitlement(true)
        if (!purchase.isAcknowledged) {
          acknowledgePurchase(purchase)
        }
        onWebCallback("window.onPurchaseSuccess && window.onPurchaseSuccess();")
      }
    } else if (purchase.purchaseState == Purchase.PurchaseState.PENDING) {
      Log.d(tag, "Purchase is pending confirmation")
      onWebCallback("window.onPurchasePending && window.onPurchasePending();")
    }
  }

  private fun acknowledgePurchase(purchase: Purchase) {
    val ackParams = AcknowledgePurchaseParams.newBuilder()
      .setPurchaseToken(purchase.purchaseToken)
      .build()
    billingClient.acknowledgePurchase(ackParams) { result ->
      Log.d(tag, "Purchase acknowledged result: ${result.responseCode}")
    }
  }

  private fun setPremiumEntitlement(active: Boolean) {
    if (isPremium != active) {
      isPremium = active
      prefs.edit().putBoolean(keyIsPremium, active).apply()
      onPremiumStatusChanged(active)
      onWebCallback("window.onPremiumStatusUpdated && window.onPremiumStatusUpdated($active);")
    }
  }

  fun launchPurchaseFlow(activity: Activity) {
    if (isPremium) {
      Log.d(tag, "Already premium")
      onWebCallback("window.onPurchaseSuccess && window.onPurchaseSuccess();")
      return
    }

    if (!isConnected) {
      // In sandbox/development when Play Store is unreachable, provide test flow
      Log.w(tag, "Play Billing disconnected, attempting to reconnect...")
      startConnection()
    }

    val productList = listOf(
      QueryProductDetailsParams.Product.newBuilder()
        .setProductId(productIdRemoveAds)
        .setProductType(BillingClient.ProductType.INAPP)
        .build()
    )

    val params = QueryProductDetailsParams.newBuilder()
      .setProductList(productList)
      .build()

    billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsResult ->
      val productDetailsList = productDetailsResult.productDetailsList
      if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && !productDetailsList.isNullOrEmpty()) {
        val productDetails = productDetailsList[0]
        val flowParams = BillingFlowParams.newBuilder()
          .setProductDetailsParamsList(
            listOf(
              BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(productDetails)
                .build()
            )
          )
          .build()

        activity.runOnUiThread {
          billingClient.launchBillingFlow(activity, flowParams)
        }
      } else {
        Log.w(tag, "Could not fetch Play product details (${billingResult.debugMessage}). Real Play Store item '$productIdRemoveAds' required.")
        activity.runOnUiThread {
          val errorMsg = org.json.JSONObject.quote("Google Play Store item '$productIdRemoveAds' is not configured yet on Google Play Console.")
          onWebCallback("window.onPurchaseError && window.onPurchaseError($errorMsg);")
        }
      }
    }
  }

  fun restorePurchases() {
    if (!isConnected) {
      startConnection()
    }

    val params = QueryPurchasesParams.newBuilder()
      .setProductType(BillingClient.ProductType.INAPP)
      .build()

    billingClient.queryPurchasesAsync(params) { billingResult, purchasesList ->
      var restored = false
      if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && !purchasesList.isNullOrEmpty()) {
        for (purchase in purchasesList) {
          if (purchase.products.contains(productIdRemoveAds) || purchase.products.contains("premium")) {
            if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
              restored = true
              setPremiumEntitlement(true)
              if (!purchase.isAcknowledged) {
                acknowledgePurchase(purchase)
              }
            }
          }
        }
      } else {
        // Check saved preference state
        restored = prefs.getBoolean(keyIsPremium, false)
        if (restored) {
          setPremiumEntitlement(true)
        }
      }
      onWebCallback("window.onPurchaseRestored && window.onPurchaseRestored($restored);")
    }
  }

  fun endConnection() {
    try {
      billingClient.endConnection()
    } catch (_: Exception) {}
  }
}
