# Landing evidence retention

Real report photographs are not bundled here. The landing example loads its two photos through the normal /media routes, which check report visibility on every request and stop serving removed evidence. An unavailable state replaces a photo when access fails.

The former lucknow-original.jpg and lucknow-revisit.jpg copies were removed from the bundle on 11 October 2026. The new service worker excludes this directory and clears previous shell caches when it activates. Previously downloaded files, old browser HTTP caches and copies published elsewhere cannot be recalled by this deployment.
