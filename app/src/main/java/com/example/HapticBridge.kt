package com.example

import android.content.Context
import android.os.VibrationEffect
import android.os.Vibrator
import android.os.VibratorManager
import android.webkit.JavascriptInterface
import androidx.annotation.Keep

@Keep
class HapticBridge(private val context: Context) {
  private val vibrator: Vibrator? by lazy {
    val vibratorManager = context.getSystemService(Context.VIBRATOR_MANAGER_SERVICE) as? VibratorManager
    vibratorManager?.defaultVibrator
  }

  @JavascriptInterface
  fun vibrate(durationMs: Long) {
    val vib = vibrator ?: return
    try {
      vib.vibrate(VibrationEffect.createOneShot(durationMs.coerceIn(10, 500), VibrationEffect.DEFAULT_AMPLITUDE))
    } catch (_: Exception) {}
  }

  @JavascriptInterface
  fun click() {
    val vib = vibrator ?: return
    try {
      vib.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_CLICK))
    } catch (_: Exception) {}
  }

  @JavascriptInterface
  fun heavyImpact() {
    val vib = vibrator ?: return
    try {
      vib.vibrate(VibrationEffect.createPredefined(VibrationEffect.EFFECT_HEAVY_CLICK))
    } catch (_: Exception) {}
  }
}
