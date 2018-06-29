//show customer information on click
console.log($(this.triggeringElement), $(this.triggeringElement).find('.customer'), $(this.triggeringElement).find('.customer').attr('oid'));

const id = $(this.triggeringElement).find('.customer').attr('oid');