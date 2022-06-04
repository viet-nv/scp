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
            intent.putExtra(ACCESS_TOKEN, "bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZWMxOGVmYS0zZTVmLTVjY2QtZTA1My02MjE5OWYwYTEyMTAiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoidmlldG52MTMwNEBnbWFpbC5jb20iLCJzY29wZSI6WyJyZWFkIl0sImlzcyI6Imh0dHBzOi8vbG9jYWxob3N0IiwibmFtZSI6InZpZXRudjEzMDRAZ21haWwuY29tIiwidXVpZF9hY2NvdW50IjoiZGVjMThlZmEtM2U1Zi01Y2NkLWUwNTMtNjIxOTlmMGExMjEwIiwiYXV0aG9yaXRpZXMiOlsiVVNFUiJdLCJqdGkiOiI2MGY2YjhhMS1iOGNmLTQ2OTgtOTBhOC1iNzc4YjY4OTc0YTIiLCJjbGllbnRfaWQiOiJhZG1pbmFwcCJ9.7qzX1qy6JE-SLBrJ2eTEGxmeDAGXh7s_plaJO3NkuIXWzQNj-HVTjUVE580-wLqn9BsQ2y40sCmFn79Q-ho57aAg-0ITB0_CkX93J79gBi086gP620CGyYYc_54udlXRoSmxOFPvbW0V_FmCroCKs6Ge_eVhwWzR6lYLvN1TINT5m655DJ-Lyuthp49PgKaoSC-ZPvXrzR-Iq9KTPljXDW5ksbrTg0d-fkRbp_XlQvDztI4XI09Od40TDJL_YBmJOz0GvEdlse8qkS85WrOxrbU70stdQLzwT2qoYUHiCVPPpRErLa1d5rFwLwAuKH8YS3y_CZqU1Iu8bDEn8pjTPA");
            intent.putExtra(TOKEN_ID, "dec192ea-5f0c-1429-e053-63199f0a4ee9");
            intent.putExtra(TOKEN_KEY, "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAIsvRqZt14oaQXIFbMzjQMBhKhuh8eZbef6zbD0VugfsV0R5qIfNq4pMgdCoKJFlh1RBKt0Tfu6984hgXW+OPOMCAwEAAQ==");
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
