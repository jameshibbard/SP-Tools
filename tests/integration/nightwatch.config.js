/* global module */

module.exports = {
  src_folders: ['tests/integration/tests/'],
  output_folder: 'tests/integration/reports',
  page_objects_path: '',
  custom_commands_path: '',
  custom_assertions_path: '',

  webdriver: {
    start_process: true,
    port: 9515,
    server_path: 'node_modules/.bin/chromedriver',
    log_path: false,
    cli_args: [],
  },

  test_settings: {
    default: {
      desiredCapabilities: {
        browserName: 'chrome',
        chromeOptions: {
          args: [
            'load-extension=./',
            '--test-type',
          ],
        },
      },
    },
  },
};
