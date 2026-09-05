# Elite Scope — Mobile App

## Setup

```bash
npm install
cp .env.example .env   # fill in EXPO_PUBLIC_API_URL and the RevenueCat keys
```

## Testing in-app purchases (RevenueCat)

**Expo Go cannot run this app's purchase flow.** `react-native-purchases` is a native
module, and Expo Go only ships Expo's own precompiled set of native modules — it can't
load third-party ones like RevenueCat's SDK. If you run this app in Expo Go you'll see:

- Tier prices falling back to a stale/placeholder number instead of the real App Store price
- "Unavailable" when tapping Select Plan, even if everything is configured correctly

This is expected in Expo Go and isn't a sign anything is broken — the paywall now shows an
amber banner explaining this instead of failing silently. To actually test purchases, use
one of:

- **A development build** (recommended for iterating): `eas build --profile development
  --platform ios`, install the resulting build on your device/simulator, then run
  `npx expo start --dev-client`.
- **`npx expo run:ios`** if you're on a Mac and want a local build without EAS.
- **TestFlight** or the App Store build — both include the native code and work out of the box.

Sandbox App Store purchases (test cards, no real charges) work the same way in a
development build as in TestFlight — sign in with a Sandbox Apple Account on the device
under Settings → App Store → Sandbox Account.

### Checklist: App Store Connect ↔ RevenueCat ↔ this app

Three different systems each have their own identifier for the same product, and all
three have to agree. If purchases still don't work in a real (non–Expo Go) build, check
this chain end to end:

| Layer | Identifier | Where it's set | What this app expects |
|---|---|---|---|
| App Store Connect | **Product ID** | subscription product page | `com.woteva.elite.strategist.monthly`, `com.woteva.elite.mathematician.monthly` (see `PRODUCT_TIER_MAP` in the backend's `webhook.controller.ts`) |
| RevenueCat | **Entitlement identifier** | Entitlements tab | `strategist`, `mathematician` — must match exactly, since the backend reads these straight off webhook/API payloads as the tier name (`revenuecat.service.ts`) |
| RevenueCat | **Offering → Package identifier** | Offerings tab, must be on the Offering marked "current" | `strategist_monthly`, `mathematician_monthly` (see `PACKAGE_ID_BY_TIER` in `app/(app)/paywall.tsx`) |
| This app | `EXPO_PUBLIC_REVENUECAT_IOS_KEY` | `.env` | The **public** API key from RevenueCat → Project Settings → API Keys → Apple App Store (starts `appl_`) — not the secret key, that's backend-only |

If any of these drift out of sync, `getOfferings()` will succeed but return no matching
package, and the paywall will show "Unavailable" even outside Expo Go.

### Backend also needs

- `REVENUECAT_SECRET_KEY` — server-only, from RevenueCat → Project Settings → API Keys
- `REVENUECAT_WEBHOOK_SECRET` — must match the Authorization header value you set when
  adding the webhook URL in RevenueCat → Project Settings → Integrations → Webhooks

### Keeping displayed prices accurate

The paywall always shows RevenueCat's live, localized price once it loads — never a
hardcoded number. The `price` field on each tier in Firestore (editable from the admin
app's Tiers screen) is only a fallback shown while the live price is still loading, so
it's worth keeping roughly in sync with App Store Connect, but it is never what a user
is actually charged.
