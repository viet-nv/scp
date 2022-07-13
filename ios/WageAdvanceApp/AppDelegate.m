#import "AppDelegate.h"

#if RCT_DEV
#import <React/RCTDevLoadingView.h>
#endif

#import <React/RCTBridge.h>
#import <React/RCTBundleURLProvider.h>
#import <React/RCTRootView.h>

#ifdef FB_SONARKIT_ENABLED
#import <FlipperKit/FlipperClient.h>
#import <FlipperKitLayoutPlugin/FlipperKitLayoutPlugin.h>
#import <FlipperKitUserDefaultsPlugin/FKUserDefaultsPlugin.h>
#import <FlipperKitNetworkPlugin/FlipperKitNetworkPlugin.h>
#import <SKIOSNetworkPlugin/SKIOSNetworkAdapter.h>
#import <FlipperKitReactPlugin/FlipperKitReactPlugin.h>

static void InitializeFlipper(UIApplication *application) {
  FlipperClient *client = [FlipperClient sharedClient];
  SKDescriptorMapper *layoutDescriptorMapper = [[SKDescriptorMapper alloc] initWithDefaults];
  [client addPlugin:[[FlipperKitLayoutPlugin alloc] initWithRootNode:application withDescriptorMapper:layoutDescriptorMapper]];
  [client addPlugin:[[FKUserDefaultsPlugin alloc] initWithSuiteName:nil]];
  [client addPlugin:[FlipperKitReactPlugin new]];
  [client addPlugin:[[FlipperKitNetworkPlugin alloc] initWithNetworkAdapter:[SKIOSNetworkAdapter new]]];
  [client start];
}
#endif

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
#ifdef FB_SONARKIT_ENABLED
  InitializeFlipper(application);
#endif

  RCTBridge *bridge = [[RCTBridge alloc] initWithDelegate:self launchOptions:launchOptions];

  #if RCT_DEV
    [bridge moduleForClass:[RCTDevLoadingView class]];
  #endif

  RCTRootView *rootView = [[RCTRootView alloc] initWithBridge:bridge
                                                   moduleName:@"WageAdvanceApp"
                                            initialProperties:nil];

  if (@available(iOS 13.0, *)) {
      rootView.backgroundColor = [UIColor systemBackgroundColor];
  } else {
      rootView.backgroundColor = [UIColor whiteColor];
  }

  self.window = [[UIWindow alloc] initWithFrame:[UIScreen mainScreen].bounds];
  UIViewController *rootViewController = [UIViewController new];
  rootViewController.view = rootView;
  self.window.rootViewController = rootViewController;
  [self.window makeKeyAndVisible];

  SaveData.shared.SDTokenKey = @"MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAJG+7yjM11qSToRJ96bNmKesY+LNLBHuSaqMFxVEPWJ2y8jEKqqXAGeNJqP2BxSCvZKjcD9G67atTdOjwJ9ijWcCAwEAAQ==";
  SaveData.shared.SDTokenId = @"e180718c-8965-7d27-e053-62199f0a99a1";
  SaveData.shared.SDAuthorization = @"bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdWQiOlsicmVzdHNlcnZpY2UiXSwidXNlcl9uYW1lIjoic29sZWlsdm4uMTNAZ21haWwuY29tIiwic2NvcGUiOlsicmVhZCJdLCJpc3MiOiJodHRwczovL2xvY2FsaG9zdCIsIm5hbWUiOiJzb2xlaWx2bi4xM0BnbWFpbC5jb20iLCJ1dWlkX2FjY291bnQiOiJlMTgwNzAwYy1lNmM3LTRlZjAtZTA1My02MzE5OWYwYTk1MWIiLCJhdXRob3JpdGllcyI6WyJVU0VSIl0sImp0aSI6IjEyMjRlMzdhLTFmZjktNDBiZS05NGFjLWI5NGU5YzExNWRmMCIsImNsaWVudF9pZCI6ImFkbWluYXBwIn0.2pFa6UgsDna7HPjehAxw4RJRFY2Sgh5G6x5mnMPKwPn2n9hO0DtOZwkgGNgulqhrNY-NtRtLf3a5MIeykY1ICUFTZeJzsl1-OWz3bzBgyQLSpEpkdEucO_U6g2yg0VXzkKI6wAnhNOgGQT9ENMTb3SWKR55mtQmQzQ0d40FSm0ILAkFx9VCbm18RuAeECZKSyMItFr_Umsc4TJFS5t2tpTeA15dQC7aweNz8Px_YLgVTWjcrb05mzd2G6Pof9dKxJKuHOrN0Jda996KcJ2M70V774tVNLCC174FqNsXvb9gymz-DH5rACCBJLpPlFZ6ov6Qhk3rDcJCJpcGCuaR3KQ";
  SaveData.shared.ExpriseTime = 120;

  return YES;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index" fallbackResource:nil];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
