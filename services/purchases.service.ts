import { Platform } from "react-native";
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";

// Same env-var convention already used for EXPO_PUBLIC_API_URL in config/axios.ts.
const REVENUECAT_IOS_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY || "";
const REVENUECAT_ANDROID_KEY =
  process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY || "";

export type PurchasesUnavailableReason =
  | "native-module-missing" // running in Expo Go — react-native-purchases needs a dev/production build
  | "no-api-key" // EXPO_PUBLIC_REVENUECAT_*_KEY isn't set for this platform
  | "configure-failed"; // SDK threw during configure() for some other reason

let isConfigured = false;
let unavailableReason: PurchasesUnavailableReason | null = null;

/**
 * react-native-purchases is a native module — it does NOT work in Expo Go, only in a custom
 * development build (`eas build --profile development`), TestFlight/internal build, or a
 * production build. Expo Go's JS bundle loads fine (this file imports without crashing), but
 * any call that reaches into native code throws. We catch that here rather than let it take
 * down the app, and record *why* so the UI can explain it instead of a generic failure.
 */
export function configurePurchases() {
  if (isConfigured || unavailableReason) return;

  const apiKey =
    Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
  if (!apiKey) {
    unavailableReason = "no-api-key";
    console.warn(
      `[purchases] No RevenueCat key set for ${Platform.OS} — in-app purchases are disabled until EXPO_PUBLIC_REVENUECAT_${Platform.OS.toUpperCase()}_KEY is configured.`,
    );
    return;
  }

  try {
    Purchases.configure({ apiKey });
    if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
    isConfigured = true;
  } catch (error) {
    // This is the error you'll see in Expo Go — the native module simply isn't linked there.
    unavailableReason = "native-module-missing";
    console.warn(
      "[purchases] Purchases.configure() failed — if you're running this in Expo Go, that's " +
        "expected: react-native-purchases needs a development build. Run " +
        "`eas build --profile development --platform ios` (or `npx expo run:ios`), install " +
        "that build, then run `npx expo start --dev-client`. Original error:",
      error,
    );
  }
}

/** Whether purchases are usable right now. Check this before calling getOfferings/purchasePackage. */
export function isPurchasesReady(): boolean {
  return isConfigured;
}

/** Why purchases aren't usable, for showing an explanatory (not scary) message in the UI. */
export function getPurchasesUnavailableReason(): PurchasesUnavailableReason | null {
  return unavailableReason;
}

/** Associate the RevenueCat customer with our own Firestore uid. Call right after login/signup. */
export async function identifyPurchaser(uid: string) {
  if (!isConfigured) return;
  try {
    await Purchases.logIn(uid);
  } catch (error) {
    console.warn("[purchases] logIn failed", error);
  }
}

/** Call on logout / account deactivation so the next login doesn't inherit this customer's state. */
export async function resetPurchaser() {
  if (!isConfigured) return;
  try {
    await Purchases.logOut();
  } catch (error) {
    console.warn("[purchases] logOut failed", error);
  }
}

export async function getCurrentOffering(): Promise<PurchasesOffering | null> {
  if (!isConfigured) return null;
  try {
    const offerings = await Purchases.getOfferings();
    if (!offerings.current) {
      console.warn(
        "[purchases] getOfferings() succeeded but there's no current Offering. In RevenueCat, " +
          "go to Offerings and make sure one Offering is marked \"current\", and that it has " +
          "Packages attached with the identifiers the app expects (see PACKAGE_ID_BY_TIER in " +
          "app/(app)/paywall.tsx).",
      );
    }
    return offerings.current;
  } catch (error) {
    console.warn("[purchases] getOfferings failed", error);
    return null;
  }
}

/**
 * Package identifiers match the "custom identifier" convention set up in RevenueCat's
 * Offering — see PACKAGE_ID_BY_TIER in app/(app)/paywall.tsx: "strategist_monthly" /
 * "mathematician_monthly". Weekly/annual variants get their own identifiers when those
 * products are added later.
 */
export async function findPackage(
  identifier: string,
): Promise<PurchasesPackage | null> {
  const offering = await getCurrentOffering();
  return (
    offering?.availablePackages.find((p) => p.identifier === identifier) ?? null
  );
}

export type PurchaseOutcome =
  | { status: "success"; customerInfo: CustomerInfo }
  | { status: "cancelled" }
  | { status: "error"; message: string };

export async function purchasePackage(
  pkg: PurchasesPackage,
): Promise<PurchaseOutcome> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    return { status: "success", customerInfo };
  } catch (error: any) {
    if (error?.userCancelled) {
      return { status: "cancelled" };
    }
    return {
      status: "error",
      message: error?.message || "Purchase failed. Please try again.",
    };
  }
}

export async function restorePurchases(): Promise<CustomerInfo | null> {
  if (!isConfigured) return null;
  return Purchases.restorePurchases();
}

/** Deep-links to Apple's native subscription management — the only Apple-compliant way to cancel. */
export async function openManageSubscriptions() {
  if (!isConfigured) return;
  await Purchases.showManageSubscriptions();
}
