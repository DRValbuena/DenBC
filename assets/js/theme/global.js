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

          //begin Custom Code for Bulk Ordering
          const productArray = new Array();
          var sizeOptions = $("div[data-product-attribute=input-number]");
          var sizeCode = $("div[data-product-attribute=set-rectangle] input");
          var sizeUrlParameter = $("div[data-product-attribute=set-rectangle] input").attr('name');
          var colorUrlParameter = $("div[data-product-attribute=swatch] input").attr('name');
          var productId = $("form input[name=product_id]").attr('value');
          console.log(productId);
          //store products
          // const productArray = new Array();
          //
          // console.log(colorOption);
          // for(var i = 0; i<sizeOptions.length; i++){
          //   const product = new Object();
          //   product.size = $(sizeOptions[i]).first().text().replace(':','').replace(/\s+/g,'');
          //   product.colorCode = $("div[data-product-attribute=swatch]:first input:checked").attr('value');
          //   //console.log($(sizeOptions[i]).first().text().replace(':','').replace(/\s+/g,''));
          //   product.sizeQty = $(sizeOptions[i]).find('input').val();
          //   //console.log($(sizeOptions[i]).find('input').val());
          //   productArray.push(product);
          // }
          // console.log(sizeCode);
          // for(var i = 0; i<sizeCode.length; i++){
          //   console.log($(sizeCode[i]).val());
          // }
          $("button[data-action=inc]").on("click",function(){

            //console.log("increase button clicked");
            //console.log($("div[data-product-attribute=swatch]:first input:checked").attr('value'));
            for(var i = 0; i<sizeOptions.length; i++){
              const product = new Object();
              product.size = $(sizeOptions[i]).first().text().replace(':','').replace(/\s+/g,'');
              product.colorCode = $("div[data-product-attribute=swatch]:first input:checked").attr('value');
              product.sizeCode = $(sizeCode[i]).val();
              //console.log($(sizeOptions[i]).first().text().replace(':','').replace(/\s+/g,''));
              product.sizeQty = $(sizeOptions[i]).find('input').val();
              //console.log($(sizeOptions[i]).find('input').val());
              productArray.push(product);
            }
            console.log(productArray);


            loop_Ajax(0);
            function loop_Ajax(i) {
              if(i === productArray.length) {
                console.log("end");
                window.location.href="/cart.php?";
                return;
              }
              var productContent = productArray[i];
              var pid = productId;
              var sizeQty = productContent.sizeQty;
              var sizeCode = productContent.sizeCode;
              var colorCode = productContent.colorCode;
              var addToCartUrl = "/cart.php?action=add&qty=" + sizeQty + "&product_id=" + pid + "&" +sizeUrlParameter+"="+sizeCode+"&"+colorUrlParameter+"="+colorCode;
              $.ajax({
                type: 'GET',
                url: addToCartUrl,
                // beforeSend: function() {
                //   $('#loadingDiv').show();
                // },
                success: function() {
                  console.log(productId + "success");
                },
                error: function(XMLHttpRequest, textStatus, errorThrown) {
                  console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
                },
                complete: function(){
                  i++;
                  loop_Ajax(i++);
                },
              });
            }

          });

          //end Custom Code for Bulk Ordering

    }
}
