import $ from 'jquery';
import './common/select-option-plugin';
import 'html5-history-api';
import PageManager from './page-manager';
import quickSearch from './global/quick-search';
import currencySelector from './global/currency-selector';
import mobileMenuToggle from './global/mobile-menu-toggle';
import menu from './global/menu';
import foundation from './global/foundation';
import quickView from './global/quick-view';
import cartPreview from './global/cart-preview';
import compareProducts from './global/compare-products';
import privacyCookieNotification from './global/cookieNotification';
import maintenanceMode from './global/maintenanceMode';
import carousel from './common/carousel';
import 'lazysizes';
import loadingProgressBar from './global/loading-progress-bar';
import FastClick from 'fastclick';
import sweetAlert from './global/sweet-alert';

function fastClick(element) {
    return new FastClick(element);
}

export default class Global extends PageManager {
    /**
     * You can wrap the execution in this method with an asynchronous function map using the async library
     * if your global modules need async callback handling.
     * @param next
     */
    loaded(next) {
        fastClick(document.body);
        quickSearch();
        currencySelector();
        foundation($(document));
        quickView(this.context);
        cartPreview();
        compareProducts(this.context.urls);
        carousel();
        menu();
        mobileMenuToggle();
        privacyCookieNotification();
        maintenanceMode(this.context.maintenanceMode);
        loadingProgressBar();
        sweetAlert();
        next();


          // custom code for ACP YMM

            $(".class1").hide();
            $(".class2").hide();
            $("." + $("#first").val()).show();

            $("#first").change(function() {
              $(".class1").hide();
              $("." + this.value).show();
              $("#second option:first-child").prop("selected", true);
              $("#third option:first-child").prop("selected", true);
            });

            $("#second").change(function() {
              $(".class2").hide();
              $("." + this.value).show();
              $("#third option:first-child").prop("selected", true);
              $(".vehicleSearch").attr('href',"/"+this.value+"/"+$("#third").val());
            });
            $("#third").change(function() {
              $(".vehicleSearch").attr('href',"/"+$("#first").val()+"/"+$("#second").val()+"/"+$("#third").val());
            });

          // end of custom code for ACP YMM

          // Begin Custom code for split swatch

          $("div[data-product-attribute=swatch]:first label" ).on('click',function(){
            console.log($(this).attr('data-product-attribute-value'));
            $("label[for=attribute_102]").click();
            $("input[value=102]").attr('checked',false);
          });
          $("div[data-product-attribute=swatch]:eq(1) label" ).on('click',function(){
            var firstColorChecked=  $("div[data-product-attribute=swatch]:first input:checked").attr('value');
            $("input[value="+ firstColorChecked +"]").attr('checked',false);
          });
          // Begin Custom code for split swatch
    }
}
