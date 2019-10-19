var Note_Dich_Vu = require('http');
var Port = process.env.PORT || 5000;
var fs = require("fs")
let formidable = require("formidable");
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://thanhdat010797:Quynhnhu014022308@cluster0-eqeim.gcp.mongodb.net/test?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
var Dich_vu = Note_Dich_Vu.createServer((Yeu_cau, Dap_ung) => {
    let method = Yeu_cau.method
    let url = Yeu_cau.url
    Dap_ung.setHeader("Access-Control-Allow-Origin", '*')
    Dap_ung.setHeader('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
    Dap_ung.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type')
    Dap_ung.setHeader('Access-Control-Allow-Credentials', true)
    let db = "QLPH"
    if (method == "GET") {
        if (url == "/Danh_sach_user") {
            let collection = "DANH_SACH_USER"
            client.connect(uri => {
                let collection1 = client.db(db).collection(collection)
                collection1.find({}).toArray((err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        Dap_ung.writeHead(200, { "Content-Type": "Text/json; charset=utf-8" })
                        Dap_ung.end(JSON.stringify(result));
                    }
                })

            })

        } else if (url == "/Danh_sach_ph") {
            let collection = "DANH_SACH_PH"
            client.connect(uri => {
                let collection1 = client.db(db).collection(collection)
                collection1.find({}).toArray((err, result) => {
                    if (err) {
                        console.log(err)
                    } else {
                        Dap_ung.writeHead(200, { "Content-Type": "Text/json; charset=utf-8" })
                        Dap_ung.end(JSON.stringify(result));
                    }
                })

            })

        }else if (url.match("\.png$")) {
            if (fs.existsSync(imagePath)) {
                fileStream.pipe(Dap_ung);
            var imagePath = `images2/${url}`;
            if (fs.existsSync(imagePath)) {
                let fileStream = fs.createReadStream(imagePath);
                Dap_ung.writeHead(200, { "Content-Type": "image/png" });
                fileStream.pipe(Dap_ung);
            } else {
                var imagePath = `images2/logo.png`;
                let fileStream = fs.createReadStream(imagePath);
                Dap_ung.writeHead(200, { "Content-Type": "image/png" });
                fileStream.pipe(Dap_ung);
            }
        } else {
            let Kq = "Không tìm thấy"
            Dap_ung.writeHead(200, { "Content-Type": "Text/json; charset=utf-8" })
            Dap_ung.end(Kq);
        }
    } else {

        var Noi_dung_Nhan = '';
        Yeu_cau.on('data', function (data) {
            Noi_dung_Nhan += data
        })
        if (url == "/login") {
            let collection = "DANH_SACH_USER"
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let USER = client.db(db).collection(collection)
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let Ket_qua = {
                        "Noi_dung": "Lỗi cập nhật",
                        "DATA": ""
                    };

                    let dk = {
                        $and: [
                            { "Username": Doi_tuong.Username },
                            { "Password": Doi_tuong.Password }
                        ]
                    }
                    USER.find(dk).toArray((err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            if (result[0] != undefined) {
                                Ket_qua.Noi_dung = true;
                                Ket_qua.DATA = result

                            } else {
                                Ket_qua.Noi_dung = false;
                            }
                            Dap_ung.end(JSON.stringify(Ket_qua));

                        }
                    })
                })
            })
        } else if (url == "/register_user") {
            let collection = "DANH_SACH_USER"
            let Tbl_user = client.db(db).collection(collection);

            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    var dk = {
                        "Username": Doi_tuong.Username
                    }
                    let Ket_qua = {
                        "Noi_dung": false,
                        "DATA": ""
                    };
                    Tbl_user.findOne(dk, function (err, obj) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (obj == null) {
                                Tbl_user.find().sort({ "STT": -1 }).limit(1).toArray((err, result) => {
                                    if (err) {
                                        console.log(err)
                                    } else {
                                        if ((result[0].STT + 1) >= 10) {
                                            Ma_nv = `NV000${(result[0].STT + 1)}`;
                                        } else {
                                            Ma_nv = `NV0000${(result[0].STT + 1)}`;
                                        }
                                        var Danh_sach_nguoi_dung2 = {
                                            "STT": (result[0].STT + 1),
                                            "Ma_nv": Ma_nv,
                                            "Ten": Doi_tuong.Ten,
                                            "Username": Doi_tuong.Username,
                                            "Password": Doi_tuong.Password,
                                            "Quyen": Doi_tuong.Quyen,
                                            "SDT": Doi_tuong.SDT,
                                            "EMAIL": Doi_tuong.EMAIL
                                        }
                                        Tbl_user.insertOne(Danh_sach_nguoi_dung2, function (err, result) {
                                            if (err) {
                                            } else {
                                                Ket_qua.Noi_dung = true
                                                Dap_ung.end(JSON.stringify(Ket_qua));
                                            }
                                        })
                                    }
                                })
                            } else {
                                Ket_qua.Noi_dung = false
                                Dap_ung.end(JSON.stringify(Ket_qua));
                            }

                        }

                    })

                })
            })
            //
        } else if (url == "/uploadimage") {
            let form = new formidable.IncomingForm();
            form.uploadDir = "images2/"
            form.parse(Yeu_cau, (err, fields, files) => {
                    if (err) throw err;
                    let tmpPath = files.avatar.path;
                    let newPath = form.uploadDir+files.avatar.name ;
                    fs.rename(tmpPath, newPath, (err) => {
                        if (err) throw err;
                    })
            })
        } else if (url == "/register_ph") {
            let collection = "DANH_SACH_PH"
            let Tbl_user = client.db(db).collection(collection);
            let Ket_qua = {
                "Noi_dung": false,
                "DATA": ""
            };
            var d = new Date();
            var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
            let offset = '+7'
            var date = new Date(utc + (3600000 * offset));
            let thu;
            let ngay;
            if (date.getDay() == 0) {
                thu = 'Chủ nhật'
            } else if (date.getDay() == 1) {
                thu = 'Thứ 2'
            } else if (date.getDay() == 2) {
                thu = 'Thứ 3'
            } else if (date.getDay() == 3) {
                thu = 'Thứ 4'
            } else if (date.getDay() == 4) {
                thu = 'Thứ 5'
            } else if (date.getDay() == 5) {
                thu = 'Thứ 6'
            } else if (date.getDay() == 6) {
                thu = 'Thứ 7'
            }
            if (date.getDate() < 10) {
                ngay = '0' + date.getDate()
            } else {
                ngay = date.getDate()
            }
            let data = thu + ',Ngày ' + ngay + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + 'h:' + date.getMinutes() + 'p:' + date.getSeconds() + 's'

            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let dk = {
                        $and: [
                            { "Ten": Doi_tuong.Ten },
                            { "Chinhanh": Doi_tuong.Chinhanh }
                        ]
                    }
//
                    Tbl_user.findOne(dk, function (err, obj) {
                        if (err) {
                            console.log(err);
                        } else {
                            if (obj == null) {
                                Tbl_user.find().toArray((err, result) => {
                                    if (result[0] == undefined) {
                                        var Danh_sach_ph = {
                                            "STT": 1,
                                            "Ma_ph": 'PH00001',
                                            "Ten": Doi_tuong.Ten,
                                            "Chinhanh": Doi_tuong.Chinhanh,
                                            "USER_INSERT": [{
                                                "MSNV": Doi_tuong.Ma_nv,
                                                "Ten": Doi_tuong.Ten_nv,
                                                "Time": data
                                            }],
                                            "USER_UPDATE": [],
                                            "USER_MUONPHONG": []
                                        }
                                        Tbl_user.insertOne(Danh_sach_ph, function (err, result) {
                                            if (err) {
                                            } else {
                                                Ket_qua.Noi_dung = true
                                                Dap_ung.end(JSON.stringify(Ket_qua));
                                            }
                                        })
                                    } else {
                                        Tbl_user.find().sort({ "STT": -1 }).limit(1).toArray((err, result) => {
                                            if (err) {
                                                console.log(err)
                                            } else {
                                                if ((result[0].STT + 1) >= 10) {
                                                    Ma_ph = `PH000${(result[0].STT + 1)}`;
                                                } else {
                                                    Ma_ph = `PH0000${(result[0].STT + 1)}`;
                                                }
                                                var Danh_sach_ph = {
                                                    "STT": (result[0].STT + 1),
                                                    "Ma_ph": Ma_ph,
                                                    "Ten": Doi_tuong.Ten,
                                                    "Chinhanh": Doi_tuong.Chinhanh,
                                                    "USER_INSERT": [{
                                                        "MSNV": Doi_tuong.Ma_nv,
                                                        "Ten": Doi_tuong.Ten_nv,
                                                        "Time": data
                                                    }],
                                                    "USER_UPDATE": [],
                                                    "USER_MUONPHONG": []
                                                }
                                                Tbl_user.insertOne(Danh_sach_ph, function (err, result) {
                                                    if (err) {
                                                    } else {
                                                        console.log(result);
                                                        Ket_qua.Noi_dung = true
                                                        Dap_ung.end(JSON.stringify(Ket_qua));
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            } else {
                                Ket_qua.Noi_dung = false
                                Dap_ung.end(JSON.stringify(Ket_qua));
                            }
                        }
                    })
                })
            })

        } else if (url == "/update_ph") {
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let collection = "DANH_SACH_PH"
                    let Tbl_user = client.db(db).collection(collection);
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let Ket_qua = { "Noi_dung": "Lỗi cập nhật" };
                    let dk = {
                        Ma_ph: Doi_tuong.Ma_ph
                    }
                    var d = new Date();
                    var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
                    let offset = '+7'
                    var date = new Date(utc + (3600000 * offset));
                    let thu;
                    let ngay;
                    if (date.getDay() == 0) {
                        thu = 'Chủ nhật'
                    } else if (date.getDay() == 1) {
                        thu = 'Thứ 2'
                    } else if (date.getDay() == 2) {
                        thu = 'Thứ 3'
                    } else if (date.getDay() == 3) {
                        thu = 'Thứ 4'
                    } else if (date.getDay() == 4) {
                        thu = 'Thứ 5'
                    } else if (date.getDay() == 5) {
                        thu = 'Thứ 6'
                    } else if (date.getDay() == 6) {
                        thu = 'Thứ 7'
                    }
                    if (date.getDate() < 10) {
                        ngay = '0' + date.getDate()
                    } else {
                        ngay = date.getDate()
                    }
                    let data = thu + ',Ngày ' + ngay + '-' + (date.getMonth() + 1) + '-' + date.getFullYear() + ' ' + date.getHours() + 'h:' + date.getMinutes() + 'p:' + date.getSeconds() + 's'
                    let USER_UPDATE = [{
                        "MSNV": Doi_tuong.Ma_nv,
                        "Ten": Doi_tuong.Ten_nv,
                        "Time": data
                    }]

                    let gt = {
                        $set: { Ten: Doi_tuong.Ten, Chinhanh: Number(Doi_tuong.Chinhanh), USER_UPDATE: USER_UPDATE }
                    }
                    Tbl_user.updateOne(dk, gt, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            Ket_qua.Noi_dung = true;
                            Dap_ung.end(JSON.stringify(Ket_qua));
                        }
                    })
                })
            })
        } else if (url == "/update_user") {
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let collection = "DANH_SACH_USER"
                    let Tbl_user = client.db(db).collection(collection);
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let Ket_qua = { "Noi_dung": "Lỗi cập nhật" };
                    let dk = {
                        Ma_nv: Doi_tuong.Ma_nv
                    }
                    let gt = {
                        $set: { Ten: Doi_tuong.Ten, Password: Doi_tuong.Password, Quyen: Doi_tuong.Quyen, SDT: Doi_tuong.SDT, EMAIL: Doi_tuong.EMAIL }
                    }
                    Tbl_user.updateOne(dk, gt, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            Ket_qua.Noi_dung = true;
                            Dap_ung.end(JSON.stringify(Ket_qua));
                        }
                    })
                })
            })
        } else if (url == "/delete_user") {
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let collection = "DANH_SACH_USER"
                    let Tbl_user = client.db(db).collection(collection);
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let dk = {
                        Ma_nv: Doi_tuong.Ma_nv
                    }
                    let Ket_qua = { "Noi_dung": "Lỗi máy chủ" };
                    Tbl_user.deleteOne(dk, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            Ket_qua.Noi_dung = true;
                            Dap_ung.end(JSON.stringify(Ket_qua));
                        }
                    })
                })
            })
        } else if (url == "/delete_ph") {
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let collection = "DANH_SACH_PH"
                    let Tbl_user = client.db(db).collection(collection);
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let dk = {
                        Ma_ph: Doi_tuong.Ma_ph
                    }
                    let Ket_qua = { "Noi_dung": "Lỗi máy chủ" };
                    Tbl_user.deleteOne(dk, (err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            console.log(result)
                            Ket_qua.Noi_dung = true;
                            Dap_ung.end(JSON.stringify(Ket_qua));
                        }
                    })
                })
            })
        } else if (url == "/Loc_ph") {
            Yeu_cau.on('end', function () {
                client.connect(uri => {
                    let collection = "DANH_SACH_PH"
                    let Tbl_user = client.db(db).collection(collection);
                    let Doi_tuong = JSON.parse(Noi_dung_Nhan);
                    let dk = {
                        Chinhanh: Doi_tuong.Chinhanh
                    }
                    Tbl_user.find(dk).toArray((err, result) => {
                        if (err) {
                            console.log(err)
                        } else {
                            Dap_ung.writeHead(200, { "Content-Type": "Text/json; charset=utf-8" })
                            Dap_ung.end(JSON.stringify(result));
                        }
                    })
                })
            })
        }
    }
})
Dich_vu.listen(Port,
    console.log(`Service Run: http://localhost:${Port}`)
)   