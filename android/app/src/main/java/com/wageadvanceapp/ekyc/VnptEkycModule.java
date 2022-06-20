package com.wageadvanceapp.ekyc;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import com.vnptit.idg.sdk.activity.VnptIdentityActivity;
import com.vnptit.idg.sdk.utils.SDKEnum;

import static android.app.Activity.RESULT_OK;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.ACCESS_TOKEN;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CALL_ADD_FACE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CAMERA_FOR_PORTRAIT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CHECK_LIVENESS_CARD;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.CHECK_MASKED_FACE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.DOCUMENT_TYPE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.LANGUAGE;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.LIVENESS_ADVANCED;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SELECT_DOCUMENT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_DIALOG_SUPPORT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_RESULT;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.SHOW_SWITCH;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.TOKEN_ID;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.TOKEN_KEY;
import static com.vnptit.idg.sdk.utils.KeyIntentConstants.VERSION_SDK;
import static com.vnptit.idg.sdk.utils.KeyResultConstants.INFO_RESULT;

public class VnptEkycModule extends ReactContextBaseJavaModule implements ActivityEventListener {

    private final ReactApplicationContext reactContext;

    public VnptEkycModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
        reactContext.addActivityEventListener(this);
    }

    private Callback mCallback;

    @Override
    public String getName() {
        return "VnptEkyc";
    }

    @ReactMethod
    public void ekyc(String stringArgument, Callback callback) {
        mCallback = callback;
        openEKYC();
    }

    private void openEKYC() {
        Intent intent = new Intent(reactContext.getCurrentActivity(), VnptIdentityActivity.class);
        if (intent != null) {
            intent.putExtra(ACCESS_TOKEN, "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoiU29sZWlsdm4uMTNAZ21haWwuY29tIiwic2NvcGUiOlsicmVhZCJdLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdCIsIm5hbWUiOiJTb2xlaWx2bi4xM0BnbWFpbC5jb20iLCJ1dWlkX2FjY291bnQiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjIyNTdkYWU4LWIxZGYtNGM4YS1iZTVhLTUwNWUzYTdiYTdjNyIsImNsaWVudF9pZCI6ImFkbWluYXBwIn0.rcFKOiPa-pOQU-iy_J0xZl79jNUFwallDR8HnFHKy05V2Bg0OXtbEhXua0SQ3w5fGf37IwGV55CdT83gRhdBonq3Zt6VVYiYFw7QHT9SeZPnR8CkTMzMc3oiIGh-4vKMoe5hePMRElyscqY6--mt7YyO-SJ3UzEMZLwTka_rRE5YyDV0bub2rbyK5vyX7BT5hsnql64_kKfPZcRKhRLigXr3549OvH0cvKb-76crghXyvFhmJMvjgJAdDtdvPnPxrkUYwzgM1ASaMadKNZrogA-mvAvJNtD0-Y3pXOjOurVIEbPCUaMDBTMucOXMMcMz_5eK_x7uKHt-RryhbVIEPw");
            intent.putExtra(TOKEN_ID, "e1e52981-b88d-3226-e053-63199f0ae10f");
            intent.putExtra(TOKEN_KEY, "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIbmNsr8nGnOgNZYrTql3Umv83yM1MAf5IFCn611w7E0M+w3BfjXjvK/pDgVdCVirIYVNnqVFHU7g7EBDdiAxIkCAwEAAQ==");
            intent.putExtra(DOCUMENT_TYPE, SDKEnum.DocumentTypeEnum.IDENTITY_CARD.getValue());
            intent.putExtra(SELECT_DOCUMENT, false);
            intent.putExtra(VERSION_SDK, SDKEnum.VersionSDKEnum.ADVANCED.getValue());
            intent.putExtra(SHOW_RESULT, true);
            intent.putExtra(SHOW_DIALOG_SUPPORT, true);
            intent.putExtra(CAMERA_FOR_PORTRAIT, SDKEnum.CameraTypeEnum.FRONT.getValue());
            intent.putExtra(SHOW_SWITCH, false);
            intent.putExtra(CALL_ADD_FACE, false);
            intent.putExtra(LIVENESS_ADVANCED, true);
            intent.putExtra(CHECK_MASKED_FACE,true);
            intent.putExtra(CHECK_LIVENESS_CARD,true);
            intent.putExtra(LANGUAGE, SDKEnum.LanguageEnum.VIETNAMESE.getValue());
            reactContext.getCurrentActivity().startActivityForResult(intent, 1);
        }
    }


    @Override
    public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent data) {
        Toast.makeText(activity, "show", Toast.LENGTH_SHORT).show();
        if (requestCode == 1) {
            if (resultCode == RESULT_OK) {
                String strDataInfo = data.getStringExtra(INFO_RESULT);

                mCallback.invoke(strDataInfo);
            }
        }
    }

    @Override
    public void onNewIntent(Intent intent) {

    }
}
