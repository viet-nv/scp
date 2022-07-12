#import <FinalSDK/FinalSDK.h>
#import <Foundation/Foundation.h>
#import <React/RCTLog.h>
#import <UIKit/UIKit.h>
#import "AppDelegate.h"
#import "RNEkycVnptSdk.h"

@interface RNEkycVnptSdk()
@property(nonatomic, strong) RCTPromiseResolveBlock _resolve;
@property(nonatomic, strong) RCTPromiseRejectBlock _reject;
@end

@implementation RNEkycVnptSdk

RCT_EXPORT_MODULE(RNEkycVnptSdk)

RCT_EXPORT_METHOD(initVnptEkyc:(NSString*)type resoler:(RCTPromiseResolveBlock)resole rejecter:(RCTPromiseRejectBlock)reject){
  dispatch_sync(dispatch_get_main_queue(), ^{
    self._resolve = resole;
    self._reject = reject;

    // self._resolve(@"result from sdk ios");
    // self._reject(@"EKYC_VNPT_SDK_CANCELLED", @"Cancelled", nil);
    [self showVnptEkycViewController:type];
  });
}

- (void)showVnptEkycViewController:(NSString *)type {
  RCTLogInfo(@"chuan bi call sang ekyc vnpt");
  [self initParamSdk];

  UIViewController *root =
      [[[UIApplication sharedApplication] delegate] window].rootViewController;
  BOOL modalPresent = (BOOL)(root.presentedViewController);

  if ([type isEqualToString:@"0"]) {
    SDKRootViewController *sdkRootViewController =
        [[SDKRootViewController alloc] init];
    sdkRootViewController.cameraDelegate = self;
    sdkRootViewController.isVersion = Pro;
    sdkRootViewController.isShowResult = true;
    sdkRootViewController.titleSelect = @"Xác minh thông tin";
    sdkRootViewController.subTitleSelect =
        @"<span style=\"font-family: '-apple-system', 'HelveticaNeue'; "
        @"font-size: 14\">Qúy khách vui lòng lựa chọn loại giấy tờ tùy thân "
        @"<u> đã sử dụng để đăng ký dịch vụ eMB tại MBBank</u> để xác minh "
        @"thông tin</span>";
    sdkRootViewController.modalPresentationStyle =
        UIModalPresentationFullScreen;
    sdkRootViewController.flowType = full;

    if (modalPresent) {
      UIViewController *parent = root.presentedViewController;
      [parent showViewController:sdkRootViewController sender:parent];
    } else {
      [root showDetailViewController:sdkRootViewController sender:root];
    }
  } else {
    ICEkycCameraViewController *objCamera = [[ICEkycCameraViewController alloc] init];
    objCamera.cameraDelegate = self;
    objCamera.isVersion = Pro;
    objCamera.isVersionProOval = true;
    objCamera.isShowResult = true;
    if ([type isEqualToString:@"1"]) {
      objCamera.isType = cmt;
    } else if ([type isEqualToString:@"2"]) {
      objCamera.isType = hochieu;
    } else if ([type isEqualToString:@"3"]) {
      objCamera.isType = cmtquandoi;
    } else if ([type isEqualToString:@"4"]) {
      objCamera.isType = banglaixe;
    } else {
      objCamera.isType = cmt;
    }
    objCamera.modalPresentationStyle = UIModalPresentationFullScreen;
    objCamera.flowType = full;
    objCamera.isShowHelp = true;

    if (modalPresent) {
      UIViewController *parent = root.presentedViewController;
      [parent showViewController:objCamera sender:parent];
    } else {
      [root showDetailViewController:objCamera sender:root];
    }
  }
}

- (void)initParamSdk {
  SaveData.shared.SDTokenKey = @"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJG+7yjM11qSToRJ96bNmKesY+LNLBHuSaqMFxVEPWJ2y8jEKqqXAGeNJqP2BxSCvZKjcD9G67atTdOjwJ9ijWcCAwEAAQ==";
  SaveData.shared.SDTokenId = @"e180718c-8965-7d27-e053-62199f0a99a1";
  SaveData.shared.SDAuthorization = @"bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoic29sZWlsdm4uMTNAZ21haWwuY29tIiwic2NvcGUiOlsicmVhZCJdLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdCIsIm5hbWUiOiJzb2xlaWx2bi4xM0BnbWFpbC5jb20iLCJ1dWlkX2FjY291bnQiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjEyMjRlMzdhLTFmZjktNDBiZS05NGFjLWI5NGU5YzExNWRmMCIsImNsaWVudF9pZCI6ImFkbWluYXBwIn0.2pFa6UgsDna7HPjehAxw4RJRFY2Sgh5G6x5mnMPKwPn2n9hO0DtOZwkgGNgulqhrNY-NtRtLf3a5MIeykY1ICUFTZeJzsl1-OWz3bzBgyQLSpEpkdEucO_U6g2yg0VXzkKI6wAnhNOgGQT9ENMTb3SWKR55mtQmQzQ0d40FSm0ILAkFx9VCbm18RuAeECZKSyMItFr_Umsc4TJFS5t2tpTeA15dQC7aweNz8Px_YLgVTWjcrb05mzd2G6Pof9dKxJKuHOrN0Jda996KcJ2M70V774tVNLCC174FqNsXvb9gymz-DH5rACCBJLpPlFZ6ov6Qhk3rDcJCJpcGCuaR3KQ";
   // SaveData.shared.expriseTime = 120;
  /* ConfigSDK.shared.expriseTime = 120; */
  /* ConfigSDK.shared.language = @"vi"; */
}

#pragma mark - VNPT EKYC Delegate
- (void)getResult {
  RCTLogInfo(@"callback from ekyc sdk");
  [self dismissViewController];
}

  -(void) dismissViewController{
  AppDelegate *delegate = (AppDelegate *)[[UIApplication sharedApplication] delegate];
    [delegate.inputViewController dismissViewControllerAnimated:YES completion:^{
    RCTLogInfo(@"chuan bi call callback");
    [self sentCallback];
  }];
}

- (void)sentCallback {
  RCTLogInfo(@"inside callback");
  NSString *timeoutJson =
      [NSString stringWithFormat:@"%@", SaveData.shared.networkProblem];
  NSString *infoJson =
      [NSString stringWithFormat:@"%@", SaveData.shared.jsonInfo];
  NSString *compareJson =
      [NSString stringWithFormat:@"%@", SaveData.shared.jsonCompareFace];
  NSString *livenessJson =
      [NSString stringWithFormat:@"%@", SaveData.shared.jsonLivenessFace];
  NSString *maskedFaceJson =
      [NSString stringWithFormat:@"%@", SaveData.shared.jsonCheckMask];

  NSString *imageFront = [self encodeToBase64String:SaveData.shared.imageFront
                                          typeImage:@"IMAGE_FRONT"];
  NSString *imageBack = [self encodeToBase64String:SaveData.shared.imageBack
                                         typeImage:@"IMAGE_BACK"];
  NSString *imageFace = [self encodeToBase64String:SaveData.shared.imageFace
                                         typeImage:@"IMAGE_FACE"];

   RCTLog(@"timeout data ekyc: %@", timeoutJson);
   RCTLog(@"infoJson data ekyc: %@", infoJson);
   RCTLog(@"compare data ekyc: %@", compareJson);
   RCTLog(@"liveness data ekyc: %@", livenessJson);
   RCTLog(@"maskface data ekyc: %@", maskedFaceJson);

  if (![timeoutJson isEqualToString:@""]) {
    infoJson = @"";
    compareJson = @"";
    livenessJson = @"";
    maskedFaceJson = @"";
    timeoutJson = @"timeout";
  } else {
    timeoutJson = @"";
  }

  NSDictionary *dict = @{
    @"info" : infoJson,
    @"compare" : compareJson,
    @"maskedface" : maskedFaceJson,
    @"liveness" : livenessJson,
    @"network" : timeoutJson,
    @"imageFront" : imageFront,
    @"imageBack" : imageBack,
    @"imageFace" : imageFace
  };

  NSError *error;
  NSData *data = [NSJSONSerialization dataWithJSONObject:dict
                                                 options:0
                                                   error:&error];

  if (error) {
    NSLog(@"Failure to serialize JSON object %@", error);
  }

  NSString *resultJson = [[NSString alloc] initWithData:data
                                               encoding:NSUTF8StringEncoding];

 // NSString* resultJson = [NSString stringWithFormat: @"{\"info\":%@
 //  ,\"compare\": %@, \"maskedface\": %@, \"liveness\": %@, \"network\": %@,
 //  \"imageFront\": %@, \"imageBack\": %@, \"imageFace\": %@ }", infoJson,
 //  compareJson, maskedFaceJson, livenessJson, timeoutJson, imageFront,
 //  imageBack, imageFace];

  /* // RCTLog(@"json data ekycxxxx : %@", resultJson); */
 self._resolve(resultJson);
}

- (NSString *)encodeToBase64String:(UIImage *)image typeImage:(NSString *)type {
  CGFloat width = image.size.width * 0.5;
  CGFloat height = image.size.height * 0.5;
  CGFloat quality = 0.5;
  NSUInteger sizeKb = 100;
  NSString *dataString;

  // NSLog(@"width: %i, height: %i", image.size.width, image.size.height);
  //   if([type isEqualToString:@"IMAGE_FACE"]){
  image = [self resizeWithUImage:image convertToSize:CGSizeMake(width, height)];
  //   }

  while (sizeKb > 50) {
    @autoreleasepool {
      //     uiImageResize = [self resizeWithUImage:image
      //     convertToSize:CGSizeMake(width, height)];
      dataString = [UIImageJPEGRepresentation(image, quality)
          base64EncodedStringWithOptions:
              NSDataBase64Encoding64CharacterLineLength];
      sizeKb =
          [dataString lengthOfBytesUsingEncoding:NSUTF8StringEncoding] / 1024;
      //     NSLog(@"%i bytes", sizeKb);

      quality = quality - 0.1;
    }
  }

  return dataString;
}

- (UIImage *)resizeWithUImage:(UIImage *)image convertToSize:(CGSize)size {
  UIGraphicsBeginImageContext(size);
  [image drawInRect:CGRectMake(0, 0, size.width, size.height)];
  UIImage *destImage = UIGraphicsGetImageFromCurrentImageContext();
  UIGraphicsEndImageContext();
  return destImage;
}

@end
