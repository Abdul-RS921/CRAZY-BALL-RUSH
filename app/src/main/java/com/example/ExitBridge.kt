package com.example

import android.app.Activity
import android.webkit.JavascriptInterface
import androidx.annotation.Keep

@Keep
class ExitBridge(private val activity: Activity) {
  @JavascriptInterface
  fun exitApp() {
    activity.runOnUiThread {
      activity.finish()
    }
  }
}
