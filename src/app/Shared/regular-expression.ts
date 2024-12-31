export class RegularExpression {
    static TITLE(TITLE: any): any {
      throw new Error('Method not implemented.');
    }

    static readonly VPA = '^(\\w+@[a-zA-Z0-9.]+)(,\\w+@[a-zA-Z0-9.]+)*$';//for vpa
    static readonly WALLET = '^[0-9a-zA-Z]{34}$'; // 34 digit number pattern for wallet
    static readonly OFFUS_WALLET = '^[a-zA-Z0-9,]+$'; //both onus & offus wallet
    static readonly DEVICE = '^[a-zA-Z0-9,]+$'; // Alphanumeric pattern for device
    static readonly MOBILE = '^(91)[6-9][0-9]{9}$'; // 12 digit number pattern for mobile with
    static readonly IFSC = '^[A-Z]{4}0[A-Z0-9]{6}$'; //Bank IFSC Code
    static readonly SPONSOR_NAME = '^(M\\/s |M\\/S )?[A-Za-z0-9,._&-\\s]{3,50}$';
    static readonly PCBDC_LOCATION_RADIUS = '^(100|[5-9][\\d]{1})$';
    static readonly AMOUNT = '^\\d+(?:\\.((?:5|50)))?$';
    static readonly RC = '^(?!.*\\.{2})[A-Za-z0-9_.]*$';
    static readonly MOBILE_10_DIGIT = '^[6|7|8|9][0-9]{9}$'; // 10 digit number pattern for mobile with
    static readonly EMAIL = '^(?!.*\\.\\.)[a-zA-Z0-9._$-]+@[a-zA-Z0-9.]+\\.(com|in|co|org|uk|us|net|ac|gov|coop)$';
    static readonly BANK_ACCOUNT = '^\\d{6,30}$';
    static readonly ALPHA_NUMERIC = '^[a-zA-Z0-9]+$';
    static readonly MERCHANT_NAME = '^(M\\\/s |M\\\/S )?[A-Za-z0-9,._-\\s]{3,50}$';
    static readonly PAN = '[aA-zZ]{5}[0-9]{4}[aA-zZ]{1}';
    static readonly MCC = '^\\d{4}$';
    static readonly PREFFERED_WALLET_NAME = '^[a-zA-Z\\s]+$';
    static readonly REPORT_CATEGORY_TITLE = '^(M\\\/s |M\\\/S )?[A-Za-z0-9,._-\\s]{3,50}$';
    static readonly REMARKS_REGEX = '^[a-zA-Z0-9_\\- ]+$';

    static readonly VOUCHER_COUNT = '^(?:[1-9][0-9]{0,2}|1000)$';
    static readonly VOUCHER_AMOUNT = '^[1-9][0-9]*$';
    static readonly REFID_REMARKS = '[a-zA-Z0-9\\-_. ]*';
    static readonly REMARK = '[a-zA-Z0-9\\-_. ]*';
}
