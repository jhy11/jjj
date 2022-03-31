//Order status

/* 결제완료, 상품준비완료, 배송준비중, 배송지연, 배송중, 배송완료 */
const Paid = '0';
const Completed = '1';
const Processing = '2';
const Shipping = '3';
const Delivered = '4';

/* 환불접수, 환불처리중, 환불 완료*/
const RefundRecived = '5';
const RefundProcesing = '6';
const Refunded = '7';

/* 취소접수, 취소처리중, 취소완료 */
const CancelRecieved = '8';
const CancelProcessing = '9';
const Canceled = '10';


//Order type

/* 택배배송, 근거리배송, 포장, 드라이브스루 */
const Delivery = '0';
const ShortDelivery = '1';
const PickUp = '2';
const DriveThru = '3';
