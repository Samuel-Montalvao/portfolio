jQuery(window).on("load", function () {
  "use strict";

  // HIDE PRELOADER
  $(".preloader").addClass("hide-preloader");

  // Forçando atualização inicial para o parallax
  $(window).trigger("resize").trigger("scroll");

  // SHOW/ANIMATE ANIMATION CONTAINER
  setTimeout(function () {
    $("#intro .animation-container").each(function () {
      var e = $(this);

      setTimeout(function () {
        e.addClass("run-animation");
      }, e.data("animation-delay"));
    });
  }, 700);
});

jQuery(document).ready(function ($) {
  "use strict";

  // SMOOTH SCROLL FOR SAME PAGE LINKS
  $(document).on("click", "a.smooth-scroll", function (event) {
    event.preventDefault();

    $("html, body").animate(
      {
        scrollTop: $($.attr(this, "href")).offset().top - 80,
      },
      500
    );
  });

  // SCROLL REVEAL SETUP
  window.sr = ScrollReveal();
  sr.reveal(".scroll-animated", {
    duration: 600,
    delay: 0,
    origin: "left",
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    distance: "20vh",
    viewFactor: 0.4,
    scale: 1,
  }); // PARALLAX EFFECT FOR BACKGROUND IMAGE (DESKTOP ONLY)
  if (window.innerWidth > 768) {
    // Recalcular sempre que a janela for redimensionada
    function updateParallaxParams() {
      return {
        docHeight: Math.max($(document).height(), $(document.body).height()),
        imgHeight: $(".background-img").height(),
        windowHeight: $(window).height(),
        contentHeight: $(".content-area").height(),
      };
    }

    var params = updateParallaxParams();

    // Atualizar parâmetros quando a página redimensiona
    $(window).on("resize", function () {
      params = updateParallaxParams();
    });

    $(window).scroll(function () {
      var scrolled = $(this).scrollTop();
      var parallax = $(".background-img");
      var speed = -0.3; // Negative value for opposite direction, slower speed

      // Ajustar com base na altura real do conteúdo
      var totalScrollable = params.docHeight - params.windowHeight;
      var scrollPercent = scrolled / totalScrollable;
      // Calculando o quanto a imagem deve se mover, limitado para não mostrar fundo preto
      var maxMove = params.imgHeight - params.windowHeight - 100; // 100px extra para garantir

      // Controla quanto da imagem pode se mover para evitar espaços em branco
      var idealMove = scrolled * speed;

      // Garantir que a imagem se estenda até o final da página
      if (scrollPercent > 0.9) {
        // Quando estiver chegando próximo ao final
        // Forçar mais movimento para garantir que cubra o fim da página
        idealMove = -(maxMove * scrollPercent * 1.2);
      }

      // Limitar para não mover demais em nenhuma direção
      var move = Math.min(Math.max(idealMove, -maxMove), 0);

      parallax.css("transform", "translateY(" + move + "px)");
    });
  }

  // AJAX CONTACT FORM SUBMIT
  $("#contact-form").submit(function (e) {
    e.preventDefault();
    var postdata = $(this).serialize();

    $.ajax({
      type: "POST",
      url: "assets/php/contact.php",
      data: postdata,
      dataType: "json",
      success: function (json) {
        $("#contact-form input, #contact-form textarea").removeClass("error");

        setTimeout(function () {
          if (json.nameMessage !== "") {
            $("#contact-form-name").addClass("error");
          }

          if (json.emailMessage !== "") {
            $("#contact-form-email").addClass("error");
          }

          if (json.messageMessage !== "") {
            $("#contact-form-message").addClass("error");
          }
        }, 10);

        if (
          json.nameMessage === "" &&
          json.emailMessage === "" &&
          json.messageMessage === ""
        ) {
          $(
            "#contact-form.error input, #contact-form.error textarea"
          ).removeClass("error");
          $("#contact-form").addClass("success");
          $("#contact-form textarea, #contact-form input").val("");

          setTimeout(function () {
            $("#contact-form").removeClass("success");
          }, 4000);
        }
      },
    });
  });
});
