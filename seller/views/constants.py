'''Order status'''

# 결제완료, 배송준비중, 배송지연, 배송중, 배송완료
PAID = '0'
PROCESSING = '1'
SHIPPING = '2'
DELIVERED = '3'

# 환불접수, 환불처리중, 환불 완료
REFUND_RECEIVED = '4'
REFUND_PROCESSING = '5'
REFUNDED = '6'

# 취소접수, 취소처리중, 취소완료
CANCEL_REQUESTED = '7'
CANCEL_PROCESSING = '8'
CANCELED = '9'


'''Order type'''

# 택배배송, 근거리배송, 포장, 드라이브스루
DELIVERY = '0'
SHORTDELIVERY = '1'
PICKUP = '2'
DRIVETHRU = '3'
