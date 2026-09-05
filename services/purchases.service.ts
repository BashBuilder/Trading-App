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

let isConfigured = false;

/** Call once, as early as possible in the app lifecycle (before we know who's logged in). */
export function configurePurchases() {
  if (isConfigured) return;

  const apiKey =
    Platform.OS === "ios" ? REVENUECAT_IOS_KEY : REVENUECAT_ANDROID_KEY;
  if (!apiKey) {
    console.warn(
      `[purchases] No RevenueCat key set for ${Platform.OS} — in-app purchases are disabled until EXPO_PUBLIC_REVENUECAT_${Platform.OS.toUpperCase()}_KEY is configured.`,
    );
    return;
  }

  Purchases.configure({ apiKey });
  if (__DEV__) Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  isConfigured = true;
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
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

/**
 * Package identifiers match the "custom identifier" convention set up in RevenueCat —
 * see RevenueCat-Mapping.md: "strategist_monthly" / "mathematician_monthly".
 * Weekly/annual variants will get their own identifiers when those products are added later.
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
