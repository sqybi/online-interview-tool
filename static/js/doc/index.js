/**
 * Created by Nz on 2017/11/10.
 */
let activeToolBarSelector;

function activeToolBarSelectorHide(activeToolBarSelector) {
    if (activeToolBarSelector)
        activeToolBarSelector.find('.data').eq(0).hide();
}

$(document).on('click', function (evt) {
    activeToolBarSelectorHide(activeToolBarSelector);
});

$('.toolbar-selector').on('click', function (evt) {
    evt.stopPropagation();
    activeToolBarSelectorHide(activeToolBarSelector);
    activeToolBarSelector = $(this);
    activeToolBarSelector.find('.data').eq(0).show();
});
$('.toolbar-selector .data .option').on('click', function (evt) {
    evt.stopPropagation();
    const text = $(this).html();
    activeToolBarSelector.find('.text').eq(0).html(text);
    activeToolBarSelectorHide(activeToolBarSelector);
});

$('.header').on('mouseenter', function (evt) {
    $('#disconnected-alert').height(20);
});
$('.header').on('mouseleave', function (evt) {
    $('#disconnected-alert').height(0);
});