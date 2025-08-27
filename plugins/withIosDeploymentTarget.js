const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withIosDeploymentTarget(
  config,
  { deploymentTarget = "16.6" } = {}
) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(
        config.modRequest.platformProjectRoot,
        "Podfile"
      );
      let contents = fs.readFileSync(podfilePath, "utf-8");

      // Look for the existing post_install block
      if (contents.includes("post_install do |installer|")) {
        // Inject after react_native_post_install
        const patched = contents.replace(
          /react_native_post_install\([^\)]+\)\n/,
          (match) =>
            `${match}\n  # Force iOS deployment target for all pods\n  installer.pods_project.targets.each do |target|\n    target.build_configurations.each do |config|\n      config.build_settings['IPHONEOS_DEPLOYMENT_TARGET'] = '${deploymentTarget}'\n    end\n  end\n`
        );

        fs.writeFileSync(podfilePath, patched);
      }

      return config;
    },
  ]);
};
