package com.example

import android.content.Context
import ballrush.netstech.net.R

/**
 * AdConfig manages the Google Mobile Ads (AdMob) configuration for Crazy Ball Rush.
 *
 * DEVELOPMENT / TEST vs PRODUCTION SEPARATION:
 * - When [IS_TEST_MODE] is true, the official Google Mobile Ads test IDs are used.
 *   These official sample IDs ensure real test ads are served and prevent Google AdMob policy violations.
 * - For PRODUCTION deployment:
 *     1. Set [IS_TEST_MODE] to false.
 *     2. Enter your registered Google AdMob Application ID in res/values/strings.xml (admob_app_id).
 *     3. Enter your verified Production Rewarded Ad Unit ID in [PROD_REWARDED_AD_UNIT_ID]
 *        or in strings.xml (admob_rewarded_id).
 *     4. Enter your Production Interstitial Ad Unit ID in [PROD_INTERSTITIAL_AD_UNIT_ID]
 *        or in strings.xml (admob_interstitial_id).
 * - Never place secret API keys or private billing credentials in frontend client files.
 */
object AdConfig {
  /**
   * Keep true during development, staging, and automated builds.
   * Toggle to false only when publishing official production releases.
   */
  const val IS_TEST_MODE = true

  // Google Mobile Ads Official Sample / Test IDs for Android
  const val TEST_APP_ID = "ca-app-pub-3940256099942544~3347511713"
  const val TEST_REWARDED_AD_UNIT_ID = "ca-app-pub-3940256099942544/5224354917"
  const val TEST_INTERSTITIAL_AD_UNIT_ID = "ca-app-pub-3940256099942544/1033173712"

  // Production Ad Units: Replace with verified AdMob Unit IDs from Google AdMob Dashboard
  const val PROD_REWARDED_AD_UNIT_ID = ""
  const val PROD_INTERSTITIAL_AD_UNIT_ID = ""

  fun getRewardedAdUnitId(context: Context): String {
    if (!IS_TEST_MODE && PROD_REWARDED_AD_UNIT_ID.isNotBlank()) {
      return PROD_REWARDED_AD_UNIT_ID
    }
    return context.getString(R.string.admob_rewarded_id)
  }

  fun getInterstitialAdUnitId(context: Context): String {
    if (!IS_TEST_MODE && PROD_INTERSTITIAL_AD_UNIT_ID.isNotBlank()) {
      return PROD_INTERSTITIAL_AD_UNIT_ID
    }
    return context.getString(R.string.admob_interstitial_id)
  }
}
