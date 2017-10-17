import $ from 'jquery';
import PageManager from './page-manager';

export default class Home extends PageManager {

  // custom code for ACP YMM
  loaded(next) {
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
  }
  // end of custom code for ACP YMM
}
