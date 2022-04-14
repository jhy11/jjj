//Order status

/* 결제완료, 상품준비완료, 배송준비중, 배송중, 배송완료 */
const Paid = '0';
const Completed = '1';
const Processing = '2';
const Shipping = '3';
const Delivered = '4';

/* 반품접수, 반품처리중, 반품완료*/
const RefundRecived = '5';
const RefundProcesing = '6';
const Refunded = '7';

/* 취소접수, 취소처리중, 취소완료 */
const CancelRecieved = '8';
const CancelProcessing = '9';
const Canceled = '10';

/* 배송지연 */
const Pending = '11';


//Order type

/* 택배배송, 근거리배송, 포장, 드라이브스루 */
const Delivery = '0';
const ShortDelivery = '1';
const PickUp = '2';
const DriveThru = '3';


//Product status

/* 승인신청, 판매중(승인완료), 승인반려, 판매중지 */
const Requested = '0';
const OnSale = '1';
const Rejected = '2';
const Stopped = '3';
