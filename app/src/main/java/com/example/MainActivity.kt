package com.example

import android.annotation.SuppressLint
import android.content.Intent
import ballrush.netstech.net.R
import android.graphics.Color
import android.os.Bundle
import android.view.View
import android.view.WindowInsets
import android.view.WindowInsetsController
import android.webkit.ConsoleMessage
import android.webkit.JavascriptInterface
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.activity.ComponentActivity
import androidx.activity.OnBackPressedCallback
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.annotation.Keep
import androidx.compose.foundation.layout.WindowInsets as ComposeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.example.ui.theme.MyApplicationTheme
import com.facebook.AccessToken
import com.facebook.CallbackManager
import com.facebook.FacebookCallback
import com.facebook.FacebookException
import com.facebook.FacebookSdk
import com.facebook.GraphRequest
import com.facebook.Profile
import com.facebook.login.LoginManager
import com.facebook.login.LoginResult
import org.json.JSONObject

class MainActivity : ComponentActivity() {
  private var webView: WebView? = null
  private lateinit var callbackManager: CallbackManager
  private lateinit var adMobManager: AdMobManager
  private lateinit var billingManager: BillingManager

  fun sendToWebDirect(js: String) {
    sendToWeb(js)
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    enableEdgeToEdge()
    hideSystemBars()

    adMobManager = AdMobManager(this) { js ->
      sendToWeb(js)
    }

    billingManager = BillingManager(
      this,
      onPremiumStatusChanged = { isPremium ->
        sendToWeb("window.onPremiumStatusUpdated && window.onPremiumStatusUpdated($isPremium);")
      },
      onWebCallback = { js ->
        sendToWeb(js)
      }
    )

    callbackManager = CallbackManager.Factory.create()
    FacebookSdk.setApplicationId(getString(R.string.facebook_app_id))
    FacebookSdk.setClientToken(getString(R.string.facebook_client_token))

    LoginManager.getInstance().registerCallback(
      callbackManager,
      object : FacebookCallback<LoginResult> {
        override fun onSuccess(result: LoginResult) {
          if (result.recentlyDeniedPermissions.contains("public_profile")) {
            val errorMsg = JSONObject.quote("Public profile permission was denied.")
            sendToWeb("window.onFacebookAuthError && window.onFacebookAuthError($errorMsg);")
            return
          }
          fetchFacebookUserProfile(result.accessToken)
        }

        override fun onCancel() {
          sendToWeb("window.onFacebookAuthCancel && window.onFacebookAuthCancel();")
        }

        override fun onError(error: FacebookException) {
          val errorMsg = JSONObject.quote(error.localizedMessage ?: "Facebook authentication failed")
          sendToWeb("window.onFacebookAuthError && window.onFacebookAuthError($errorMsg);")
        }
      }
    )

    onBackPressedDispatcher.addCallback(this, object : OnBackPressedCallback(true) {
      override fun handleOnBackPressed() {
        val wv = webView
        if (wv != null) {
          wv.evaluateJavascript(
            "(function() { " +
              "var g = window.crazyBallRushGame || window.escapeRunGame; " +
              "if (g && typeof g.handleAndroidBack === 'function') { " +
                "return g.handleAndroidBack() ? 'true' : 'false'; " +
              "} " +
              "return 'false'; " +
            "})()"
          ) { result ->
            val consumed = result?.replace("\"", "")?.trim() == "true"
            if (!consumed) {
              isEnabled = false
              onBackPressedDispatcher.onBackPressed()
              isEnabled = true
            }
          }
        } else {
          isEnabled = false
          onBackPressedDispatcher.onBackPressed()
          isEnabled = true
        }
      }
    })

    setContent {
      MyApplicationTheme {
        Scaffold(
          modifier = Modifier.fillMaxSize(),
          contentWindowInsets = ComposeWindowInsets(0, 0, 0, 0)
        ) { innerPadding ->
          GameWebView(
            modifier = Modifier.padding(innerPadding),
            onSetupBridge = { wv ->
              wv.addJavascriptInterface(FacebookBridge(this@MainActivity), "AndroidFacebookBridge")
              wv.addJavascriptInterface(AdsBridge(this@MainActivity, adMobManager, billingManager), "AndroidAdsBridge")
              wv.addJavascriptInterface(BillingBridge(this@MainActivity, billingManager), "AndroidBillingBridge")
              wv.addJavascriptInterface(HapticBridge(this@MainActivity), "AndroidHapticBridge")
            },
            onWebViewCreated = { wv ->
              webView = wv
            }
          )
        }
      }
    }
  }

  private fun sendToWeb(js: String) {
    runOnUiThread {
      webView?.evaluateJavascript(js, null)
    }
  }

  private fun fetchFacebookUserProfile(token: AccessToken) {
    val request = GraphRequest.newMeRequest(token) { jsonObject, response ->
      if (response?.error != null) {
        val errorMsg = JSONObject.quote(response.error?.errorMessage ?: "Facebook Graph API request failed.")
        sendToWeb("window.onFacebookAuthError && window.onFacebookAuthError($errorMsg);")
        return@newMeRequest
      }
      if (jsonObject != null) {
        val id = jsonObject.optString("id", "")
        val name = jsonObject.optString("name", "")
        val firstName = jsonObject.optString("first_name", "")
        val pictureObj = jsonObject.optJSONObject("picture")
        val dataObj = pictureObj?.optJSONObject("data")
        val pictureUrl = dataObj?.optString("url", "") ?: ""

        val payload = JSONObject().apply {
          put("id", id)
          put("name", name)
          put("firstName", firstName)
          put("pictureUrl", pictureUrl)
          put("connected", true)
        }
        sendToWeb("window.onFacebookAuthSuccess && window.onFacebookAuthSuccess($payload);")
      } else {
        val errorMsg = JSONObject.quote("Could not retrieve Facebook profile from Meta Graph API.")
        sendToWeb("window.onFacebookAuthError && window.onFacebookAuthError($errorMsg);")
      }
    }
    val parameters = Bundle().apply {
      putString("fields", "id,name,first_name,last_name,picture.type(large)")
    }
    request.parameters = parameters
    request.executeAsync()
  }

  @Deprecated("Deprecated in Java")
  override fun onActivityResult(requestCode: Int, resultCode: Int, data: Intent?) {
    callbackManager.onActivityResult(requestCode, resultCode, data)
    @Suppress("DEPRECATION")
    super.onActivityResult(requestCode, resultCode, data)
  }

  override fun onPause() {
    super.onPause()
    webView?.evaluateJavascript(
      "var g = window.crazyBallRushGame || window.escapeRunGame; if (g) g.pauseGame();",
      null
    )
    webView?.onPause()
  }

  override fun onResume() {
    super.onResume()
    hideSystemBars()
    webView?.onResume()
  }

  override fun onDestroy() {
    billingManager.endConnection()
    webView?.destroy()
    webView = null
    super.onDestroy()
  }

  private fun hideSystemBars() {
    window.insetsController?.let { controller ->
      controller.hide(WindowInsets.Type.systemBars())
      controller.systemBarsBehavior =
        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
    }
  }

  @Keep
  class FacebookBridge(private val activity: MainActivity) {
    @JavascriptInterface
    fun login() {
      activity.runOnUiThread {
        val appId = FacebookSdk.getApplicationId()
        if (appId.isNullOrBlank() || appId == "0000000000000000") {
          activity.sendToWeb(
            "window.onFacebookAuthError && window.onFacebookAuthError(" +
              JSONObject.quote("Meta App ID is not configured yet.") +
              ");"
          )
          return@runOnUiThread
        }
        try {
          // Clear any stale cached credentials before initiating fresh login
          LoginManager.getInstance().logOut()
          AccessToken.setCurrentAccessToken(null)
          Profile.setCurrentProfile(null)

          LoginManager.getInstance().logInWithReadPermissions(
            activity,
            listOf("public_profile")
          )
        } catch (e: Exception) {
          val errorMsg = JSONObject.quote(e.localizedMessage ?: "Failed to launch Facebook login.")
          activity.sendToWeb("window.onFacebookAuthError && window.onFacebookAuthError($errorMsg);")
        }
      }
    }

    @JavascriptInterface
    fun logout() {
      activity.runOnUiThread {
        try {
          LoginManager.getInstance().logOut()
          AccessToken.setCurrentAccessToken(null)
          Profile.setCurrentProfile(null)
        } catch (_: Exception) {
        }
        activity.sendToWeb("window.onFacebookLogout && window.onFacebookLogout(true);")
      }
    }

    @JavascriptInterface
    fun getLoginStatus() {
      activity.runOnUiThread {
        val token = AccessToken.getCurrentAccessToken()
        if (token != null && !token.isExpired) {
          activity.fetchFacebookUserProfile(token)
        } else {
          activity.sendToWeb("window.onFacebookLogout && window.onFacebookLogout(false);")
        }
      }
    }

    @JavascriptInterface
    fun isAppIdConfigured(): Boolean {
      val appId = FacebookSdk.getApplicationId()
      return !appId.isNullOrBlank() && appId != "0000000000000000"
    }

    @JavascriptInterface
    fun isBridgeAvailable(): Boolean {
      return true
    }
  }
}

@SuppressLint("SetJavaScriptEnabled")
@Composable
fun GameWebView(
  modifier: Modifier = Modifier,
  onSetupBridge: (WebView) -> Unit = {},
  onWebViewCreated: (WebView) -> Unit = {}
) {
  AndroidView(
    factory = { ctx ->
      WebView(ctx).apply {
        layoutParams = android.view.ViewGroup.LayoutParams(
          android.view.ViewGroup.LayoutParams.MATCH_PARENT,
          android.view.ViewGroup.LayoutParams.MATCH_PARENT
        )
        setBackgroundColor(Color.parseColor("#070814"))
        setLayerType(View.LAYER_TYPE_HARDWARE, null)

        settings.apply {
          javaScriptEnabled = true
          domStorageEnabled = true
          databaseEnabled = true
          allowFileAccess = true
          allowContentAccess = true
          @Suppress("DEPRECATION")
          allowFileAccessFromFileURLs = true
          @Suppress("DEPRECATION")
          allowUniversalAccessFromFileURLs = true
          mediaPlaybackRequiresUserGesture = false
          cacheMode = WebSettings.LOAD_DEFAULT

          useWideViewPort = true
          loadWithOverviewMode = true
          setSupportZoom(false)
          builtInZoomControls = false
          displayZoomControls = false
          textZoom = 100
        }

        webChromeClient = object : WebChromeClient() {
          override fun onConsoleMessage(consoleMessage: ConsoleMessage?): Boolean {
            android.util.Log.d(
              "CrazyBallRushJS",
              "${consoleMessage?.message()} -- line ${consoleMessage?.lineNumber()} in ${consoleMessage?.sourceId()}"
            )
            return true
          }
        }

        webViewClient = object : WebViewClient() {
          override fun shouldOverrideUrlLoading(
            view: WebView?,
            request: WebResourceRequest?
          ): Boolean {
            return false
          }
        }

        // Register JavaScript interface before loading the asset URL
        onSetupBridge(this)

        loadUrl("file:///android_asset/index.html")
      }.also { wv ->
        onWebViewCreated(wv)
      }
    },
    modifier = modifier.fillMaxSize()
  )
}
