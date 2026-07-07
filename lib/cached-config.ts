import { unstable_cache } from "next/cache";
import { getConfig } from "./store";

export const CONFIG_CACHE_TAG = "webinar-config";

/** Config read shared by all pages; invalidated via revalidateTag on admin save. */
export const getCachedConfig = unstable_cache(getConfig, ["webinar-config"], {
  tags: [CONFIG_CACHE_TAG],
});
