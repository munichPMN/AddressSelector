/**
 * Address Selector
 * Version: 0.1.0
 * Author: Pongpanot Chantana
 * GitHub: https://github.com/munichPMN/AddressSelector/
 * Description: A JavaScript library, built with jQuery, for creating address selection forms with hierarchical dropdowns.
 */

(function ($) {
    /**
     * @typedef {Object} AddressSelectorOptions
     * @property {string} [country='thailand'] - Default country
     * @property {Object} placeholder - Placeholder text for dropdowns
     * @property {string} placeholder.lv3 - Placeholder for lv3 dropdown
     * @property {string} placeholder.lv4 - Placeholder for lv4 dropdown
     * @property {string} placeholder.lv5 - Placeholder for lv5 dropdown
     * @property {string} [language='th'] - Language code
     * @property {string} jsonPath - Path to the JSON data file
     * @property {string} zipCodeField - Selector for the zip code input field
     * @property {Function} [onInit=null] - Callback function on plugin initialization
     * @property {Function} [onChange=null] - Callback function on dropdown change
     */
  
    $.fn.addressSelector = function (options) {
      // Default options
      var settings = $.extend(
        {
          country: "thailand",
          placeholder: {
            lv3: "Select lv3",
            lv4: "Select lv4",
            lv5: "Select lv5",
          },
          language: "th",
          jsonPath: "https://cdn.jsdelivr.net/gh/munichPMN/AddressSelector/data/country/",
          zipCodeField: ".zipcode",
          onInit: null,
          onChange: null,
        },
        options,
      );
  
      return this.each(function () {
        var addressForm = $(this);
        var lv3Select = addressForm.find(".lv3");
        var lv4Select = addressForm.find(".lv4");
        var lv5Select = addressForm.find(".lv5");
        var zipcodeInput = addressForm.find(settings.zipCodeField);
  
        // Fetch JSON data based on country
        $.ajax({
          url: settings.jsonPath + settings.country + ".json",
          dataType: "json",
          success: function (data) {
            // Sort data based on the specified field (name_th in this case)
            data.sort(function (a, b) {
              return a["name_" + settings.language].localeCompare(
                b["name_" + settings.language],
              );
            });
  
            // Populate lv3 dropdown
            lv3Select.append(
              '<option value="" selected disabled>' +
                settings.placeholder.lv3 +
                "</option>",
            );
            lv4Select.append(
              '<option value="" selected disabled>' +
                settings.placeholder.lv4 +
                "</option>",
            );
            lv5Select.append(
              '<option value="" selected disabled>' +
                settings.placeholder.lv5 +
                "</option>",
            );
  
            data.forEach(function (item) {
              lv3Select.append(
                '<option value="' +
                  item["name_" + settings.language] +
                  '">' +
                  item["name_" + settings.language] +
                  "</option>",
              );
            });
  
            // Event listener for lv3 change
            lv3Select.change(function () {
              var selectedlv3 = $(this).val();
              lv4Select
                .empty()
                .append(
                  '<option value="" selected disabled>' +
                    settings.placeholder.lv4 +
                    "</option>",
                );
  
              data.forEach(function (item) {
                if (item["name_" + settings.language] === selectedlv3) {
                  item.lv4.sort(function (a, b) {
                    return a["name_" + settings.language].localeCompare(
                      b["name_" + settings.language],
                    );
                  });
                  item.lv4.forEach(function (lv4) {
                    lv4Select.append(
                      '<option value="' +
                        lv4["name_" + settings.language] +
                        '">' +
                        lv4["name_" + settings.language] +
                        "</option>",
                    );
                  });
                }
              });
  
              // Callback function on dropdown change
              if (typeof settings.onChange === "function") {
                settings.onChange("lv3", selectedlv3);
              }
            });
  
            // Event listener for lv4 change
            lv4Select.change(function () {
              var selectedlv4 = $(this).val();
              lv5Select
                .empty()
                .append(
                  '<option value="" selected disabled>' +
                    settings.placeholder.lv5 +
                    "</option>",
                );
  
              data.forEach(function (item) {
                item.lv4.forEach(function (lv4) {
                  if (lv4["name_" + settings.language] === selectedlv4) {
                    lv4.lv5.sort(function (a, b) {
                      return a["name_" + settings.language].localeCompare(
                        b["name_" + settings.language],
                      );
                    });
                    lv4.lv5.forEach(function (lv5) {
                      lv5Select.append(
                        '<option value="' +
                          lv5["name_" + settings.language] +
                          '">' +
                          lv5["name_" + settings.language] +
                          "</option>",
                      );
                    });
                  }
                });
              });
  
              // Callback function on dropdown change
              if (typeof settings.onChange === "function") {
                settings.onChange("lv4", selectedlv4);
              }
            });
  
            // Event listener for lv5 change
            lv5Select.change(function () {
              var selectedlv5 = $(this).val();
  
              data.forEach(function (item) {
                item.lv4.forEach(function (lv4) {
                  lv4.lv5.forEach(function (lv5) {
                    if (lv5["name_" + settings.language] === selectedlv5) {
                      zipcodeInput.val(lv5.zip_code);
  
                      // Callback function on dropdown change
                      if (typeof settings.onChange === "function") {
                        settings.onChange("lv5", selectedlv5);
                      }
                    }
                  });
                });
              });
            });
  
            // Callback function on plugin initialization
            if (typeof settings.onInit === "function") {
              settings.onInit();
            }
          },
        });
      });
    };
  })(jQuery);
