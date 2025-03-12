#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>
#import <CallKit/CallKit.h>
#import <WebRTC/RTCAudioSession.h>

@interface AppDelegate () <CXProviderDelegate> // ✅ Declare CallKit Delegate
@end

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  //  [WebRTCModuleOptions sharedInstance].enableMultitaskingCameraAccess = YES;
  self.moduleName = @"ReactNativeChatAppArbri";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};

    // ✅ Setup CallKit Provider
  // CXProviderConfiguration *providerConfig = [[CXProviderConfiguration alloc] initWithLocalizedName:@"ChatApp"];
  // providerConfig.supportsVideo = YES; // Set to NO if you only want audio calls
  // providerConfig.maximumCallGroups = 1;
  // providerConfig.maximumCallsPerCallGroup = 1;
  // providerConfig.supportedHandleTypes = [NSSet setWithObject:@(CXHandleTypePhoneNumber)];

  // CXProvider *provider = [[CXProvider alloc] initWithConfiguration:providerConfig];
  // [provider setDelegate:self queue:nil];


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

// ✅ Fix: Implement CallKit Delegate Methods

// // Called when the call is answered (activates the WebRTC audio session)
// - (void)provider:(CXProvider *)provider didActivateAudioSession:(AVAudioSession *)audioSession {
//     [[RTCAudioSession sharedInstance] audioSessionDidActivate:audioSession];
// }

// // Called when the call ends (deactivates the WebRTC audio session)
// - (void)provider:(CXProvider *)provider didDeactivateAudioSession:(AVAudioSession *)audioSession {
//     [[RTCAudioSession sharedInstance] audioSessionDidDeactivate:audioSession];
// }

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
  return [self bundleURL];
}

- (NSURL *)bundleURL
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end
