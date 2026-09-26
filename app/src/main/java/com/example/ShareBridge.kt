package com.example

import android.app.Activity
import android.content.ActivityNotFoundException
import android.content.Intent
import android.webkit.JavascriptInterface
import androidx.annotation.Keep
import org.json.JSONObject

@Keep
class ShareBridge(private val activity: Activity) {
  @JavascriptInterface
  fun share(title: String, text: String, url: String) {
    activity.runOnUiThread {
      val content = listOf(text, url).filter(String::isNotBlank).joinToString("\n")
      val sendIntent = Intent(Intent.ACTION_SEND).apply {
        type = "text/plain"
        putExtra(Intent.EXTRA_TITLE, title)
        putExtra(Intent.EXTRA_TEXT, content)
      }

      if (sendIntent.resolveActivity(activity.packageManager) == null) {
        reportShareUnavailable()
        return@runOnUiThread
      }

      try {
        activity.startActivity(Intent.createChooser(sendIntent, title))
      } catch (_: ActivityNotFoundException) {
        reportShareUnavailable()
      }
    }
  }

  private fun reportShareUnavailable() {
    val message = JSONObject.quote("Sharing is unavailable on this device.")
    (activity as? MainActivity)?.sendToWebDirect(
      "window.onNativeShareUnavailable && window.onNativeShareUnavailable($message);"
    )
  }
}
