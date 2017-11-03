/*
 Import all product specific js
 */
import $ from 'jquery';
import PageManager from './page-manager';
import Review from './product/reviews';
import collapsibleFactory from './common/collapsible';
import ProductDetails from './common/product-details';
import videoGallery from './product/video-gallery';
import { classifyForm } from './common/form-utils';

export default class Product extends PageManager {
    constructor(context) {
        super(context);
        this.url = location.href;
        this.$reviewLink = $('[data-reveal-id="modal-review-form"]');
    }

    before(next) {
        // Listen for foundation modal close events to sanitize URL after review.
        $(document).on('close.fndtn.reveal', () => {
            if (this.url.indexOf('#write_review') !== -1 && typeof window.history.replaceState === 'function') {
                window.history.replaceState(null, document.title, window.location.pathname);
            }
        });

        next();
    }

    loaded(next) {
        let validator;

        // Init collapsible
        collapsibleFactory();

        this.productDetails = new ProductDetails($('.productView'), this.context, window.BCData.product_attributes);

        videoGallery();

        const $reviewForm = classifyForm('.writeReview-form');
        const review = new Review($reviewForm);

        $('body').on('click', '[data-reveal-id="modal-review-form"]', () => {
            validator = review.registerValidation(this.context);
        });

        $reviewForm.on('submit', () => {
            if (validator) {
                validator.performCheck();
                return validator.areAll('valid');
            }

            return false;
        });

        next();
    }

    after(next) {
        this.productReviewHandler();

        next();
    }

    productReviewHandler() {
        if (this.url.indexOf('#write_review') !== -1) {
            this.$reviewLink.click();
        }
    }


}
//********************************************************************************************************************************
//Begin custom Javascript                                                                                                        *
//********************************************************************************************************************************

//Begin Code for Bulk Ordering
//Initialize data
var bulkNum = 0;
var sizeSelect = $("div[data-product-attribute=set-rectangle]");
const productArray = new Array(); //Array to Store Product size options available
var sizeOptions = $("div[data-product-attribute=input-number]");
var sizeCode = $("div[data-product-attribute=set-rectangle] input");
var sizeUrlParameter = $("div[data-product-attribute=set-rectangle] input").attr('name');
var colorUrlParameter = $("div[data-product-attribute=swatch] input").attr('name');
var productId = $("form input[name=product_id]").attr('value');

//grab color swatch DOM
//Const input element values
const inputClass = "form-radio";
const inputType = "radio";
//Create Color Object to store color availability
var swatchList = $(".form-field[data-product-attribute='swatch']").children();
const colorArray = new Array();
for(var i = 1; i<swatchList.length; i++){
  var colorObj = new Object();
  if(swatchList[i].localName ==="input"){
    colorObj.inputName = swatchList[i].name;
    colorObj.inputId = swatchList[i].id;
    colorObj.inputValue = swatchList[i].value;
    colorObj.type = swatchList[i].localName;
    colorArray.push(colorObj);
  }
  else if (swatchList[i].localName ==="label") {
    colorObj.labelFor = swatchList[i].htmlFor;
    colorObj.type = swatchList[i].localName;
    colorObj.span = $(swatchList[i]).html();
    colorObj.inputValue = swatchList[i].dataset.productAttributeValue;
    colorArray.push(colorObj);
  }
}
var bulkNum = 1;
function generateContainer(bulkNum){
  var html ="";
  //html += "<div><p id='removeBulk' class='button alert-box'>x</p><div id=BulkNum"+ (bulkNum + 1) +" data-product-option-change style>";
  html += "<div><p id='removeBulk' class='button alert-box'>x</p><div id=bulkNum"+bulkNum+" data-product-option-change style>";
  html += "<div class='form-field' data-product-attribute='swatch'>";
  html += "<label class='form-label form-label--alternate form-label--inlineSmall'>Color:<span data-option-value=''></span><small>Required</small></label>"
  console.log("colorArray Length: " + colorArray.length);
  for(var i=0; i<colorArray.length; i++) {
    if(colorArray[i].type === 'input'){
      html += "<input class='form-radio' type='radio' name="+ colorArray[i].inputName+"_"+bulkNum+" value="+colorArray[i].inputValue +" id="+colorArray[i].inputId +"_"+bulkNum+" required='' data-state='false'>"

    }
    else if(colorArray[i].type === 'label'){
      html += "<label class='form-option form-option-swatch' for="+colorArray[i].labelFor +"bulk"+bulkNum+" data-product-attribute-value="+colorArray[i].inputValue +">";
      html += colorArray[i].span;
      html += "</label>";
    }
  }
  html += "</div>";
  for(var i=0; i<sizeOptions.length; i++) {
    html += sizeOptions[i].outerHTML;
  }
  for(var i=0; i<sizeSelect.length; i++) {
    html += sizeSelect[i].outerHTML;
  }

  html += "</div></div>";
  return html;
}//end generateContainer function

//create a new option container when Add New is clicked
$(document).on("click","#addBulk", function(){
  var genHthml = generateContainer(bulkNum);
  $("#addBulkCont").before(genHthml);
  bulkNum++;
});
//remove bulk
$(document).on("click","#removeBulk",function(){
  $(this).parent().remove();
});

//check how many BulkContainer created
var numBulkBox = $("div[data-product-option-change]").length;
var sizesPerOption = sizeOptions.length/numBulkBox;

$(document).on('click','#placeOrder',function(){
sizeOptions = $("div[data-product-attribute=input-number]");
sizeCode = $("div[data-product-attribute=set-rectangle] input");
numBulkBox = $("div[data-product-option-change]").length;
sizesPerOption = sizeOptions.length/numBulkBox;

  for(var j = 0; j<numBulkBox;j++){
    for(var i = (j*sizesPerOption); i<(sizesPerOption*(j+1)); i++){
      const product = new Object();
      product.size = $(sizeOptions[i]).first().text().replace(':','').replace(/\s+/g,'');
      product.colorCode = $("div[data-product-attribute=swatch]:eq("+j+"):first input:checked").attr('value');
      product.sizeCode = $(sizeCode[i]).val();
      product.sizeQty = $(sizeOptions[i]).find('input').val();
      productArray.push(product);
    }
  }

  //console.log($("div[data-product-attribute=swatch]:eq("+1+"):first input:checked").attr('value'));
  console.log(productArray);

  loop_Ajax(0);
  function loop_Ajax(i) {
    if(i === productArray.length) {
      //console.log("end");
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
        console.log(sizeQty + " success");
        console.log("i: " + i);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
        //console.log("Status: " + textStatus); console.log("Error: " + errorThrown);
      },
      complete: function(){
        i++;
        loop_Ajax(i++);
      },
    });
  }
});

//end Custom Code for Bulk Ordering
$(document).on('click','.form-option.form-option-swatch',function(){
     console.log("Swatch Clicked");
     console.log($(this).prev());
     $(this).prev().prop('checked',true);
//   console.log($(this).parent().parent().attr('id'));
//   var check = $(this).parent().parent().attr('id');
//   //$(this).prev().prop('checked',true);
});
