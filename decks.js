const predefinedDecks = [
  {
    id: "deck_3",
    name: "Mở rộng với 学",
    words: [
      { id: 13, zh: "学习", py: "xuéxí", vi: "Học tập", pos: "verb", weight: 5 },
      { id: 14, zh: "学生", py: "xuéshēng", vi: "Học sinh", pos: "noun", weight: 5 },
      { id: 15, zh: "学校", py: "xuéxiào", vi: "Trường học", pos: "noun", weight: 5 },
      { id: 16, zh: "大学", py: "dàxué", vi: "Đại học", pos: "noun", weight: 5 },
      { id: 17, zh: "中学", py: "zhōngxué", vi: "Trung học", pos: "noun", weight: 5 },
      { id: 18, zh: "小学", py: "xiǎoxué", vi: "Tiểu học", pos: "noun", weight: 5 },
      { id: 19, zh: "留学", py: "liúxué", vi: "Du học", pos: "verb", weight: 5 },
      { id: 20, zh: "同学", py: "tóngxué", vi: "Bạn học", pos: "noun", weight: 5 },
      { id: 21, zh: "上学", py: "shàng xué", vi: "Đi học", pos: "verb", weight: 5 },
      { id: 22, zh: "放学", py: "fàng xué", vi: "Tan học", pos: "verb", weight: 5 },
      { id: 23, zh: "开学", py: "kāi xué", vi: "Khai giảng", pos: "verb", weight: 5 },
      { id: 24, zh: "入学", py: "rù xué", vi: "Nhập học", pos: "verb", weight: 5 },
      { id: 25, zh: "学期", py: "xuéqī", vi: "Học kỳ", pos: "noun", weight: 5 },
      { id: 26, zh: "学年", py: "xuénián", vi: "Năm học", pos: "noun", weight: 5 },
      { id: 27, zh: "学费", py: "xuéfèi", vi: "Học phí", pos: "noun", weight: 5 },
      { id: 28, zh: "学分", py: "xuéfēn", vi: "Tín chỉ", pos: "noun", weight: 5 },
      { id: 29, zh: "学位", py: "xuéwèi", vi: "Học vị", pos: "noun", weight: 5 },
      { id: 30, zh: "学科", py: "xuékē", vi: "Môn học", pos: "noun", weight: 5 },
      { id: 31, zh: "学业", py: "xuéyè", vi: "Việc học", pos: "noun", weight: 5 },
      { id: 32, zh: "学问", py: "xuéwèn", vi: "Học vấn", pos: "noun", weight: 5 },

      { id: 33, zh: "学中文", py: "xué Zhōngwén", vi: "Học tiếng Trung", pos: "verb", weight: 5 },
      { id: 34, zh: "学英语", py: "xué Yīngyǔ", vi: "Học tiếng Anh", pos: "verb", weight: 5 },
      { id: 35, zh: "学编程", py: "xué biānchéng", vi: "Học lập trình", pos: "verb", weight: 5 },
      { id: 36, zh: "学电脑", py: "xué diànnǎo", vi: "Học máy tính", pos: "verb", weight: 5 },
      { id: 37, zh: "学设计", py: "xué shèjì", vi: "Học thiết kế", pos: "verb", weight: 5 },

      { id: 38, zh: "学会", py: "xuéhuì", vi: "Học được (biết làm)", pos: "verb", weight: 5 },
      { id: 39, zh: "学到", py: "xuédào", vi: "Học được", pos: "verb", weight: 5 },
      { id: 40, zh: "学懂", py: "xuédǒng", vi: "Học hiểu", pos: "verb", weight: 5 },
      { id: 41, zh: "学好", py: "xuéhǎo", vi: "Học tốt", pos: "verb", weight: 5 },
      { id: 42, zh: "学完", py: "xuéwán", vi: "Học xong", pos: "verb", weight: 5 },

      { id: 43, zh: "自学", py: "zìxué", vi: "Tự học", pos: "verb", weight: 5 },
      { id: 44, zh: "互学", py: "hù xué", vi: "Học lẫn nhau", pos: "verb", weight: 5 },

      { id: 45, zh: "好学", py: "hàoxué", vi: "Ham học", pos: "adj", weight: 5 },
      { id: 46, zh: "勤学", py: "qínxué", vi: "Chăm học", pos: "adj", weight: 5 },
      { id: 47, zh: "乐学", py: "lèxué", vi: "Yêu học", pos: "adj", weight: 5 },

      { id: 48, zh: "学无止境", py: "xué wú zhǐ jìng", vi: "Học không giới hạn", pos: "idiom", weight: 5 },
      { id: 49, zh: "活到老学到老", py: "huó dào lǎo xué dào lǎo", vi: "Học suốt đời", pos: "idiom", weight: 5 },
      { id: 50, zh: "学以致用", py: "xué yǐ zhì yòng", vi: "Học để áp dụng", pos: "idiom", weight: 5 }
    ]
  },
  {
    id: "deck_4",
    name: "Từ ghép thông dụng",
    words: [
      { id: 51, zh: "可以", py: "kěyǐ", vi: "Có thể", pos: "verb", weight: 5 },
      { id: 52, zh: "可爱", py: "kě'ài", vi: "Đáng yêu", pos: "adj", weight: 5 },
      { id: 53, zh: "可是", py: "kěshì", vi: "Nhưng", pos: "conj", weight: 5 },
      { id: 54, zh: "可能", py: "kěnéng", vi: "Có thể / khả năng", pos: "adv", weight: 5 },

      { id: 55, zh: "同意", py: "tóngyì", vi: "Đồng ý", pos: "verb", weight: 5 },
      { id: 56, zh: "名字", py: "míngzì", vi: "Tên", pos: "noun", weight: 5 },
      { id: 57, zh: "告诉", py: "gàosu", vi: "Nói với", pos: "verb", weight: 5 },
      { id: 58, zh: "咖啡", py: "kāfēi", vi: "Cà phê", pos: "noun", weight: 5 },
      { id: 59, zh: "咱们", py: "zánmen", vi: "Chúng ta", pos: "pronoun", weight: 5 },

      { id: 60, zh: "哥哥", py: "gēgē", vi: "Anh trai", pos: "noun", weight: 5 },
      { id: 61, zh: "哪里", py: "nǎlǐ", vi: "Đâu", pos: "pronoun", weight: 5 },
      { id: 62, zh: "问题", py: "wèntí", vi: "Vấn đề", pos: "noun", weight: 5 },
      { id: 63, zh: "喜欢", py: "xǐhuan", vi: "Thích", pos: "verb", weight: 5 },

      { id: 64, zh: "回来", py: "huílái", vi: "Trở về", pos: "verb", weight: 5 },
      { id: 65, zh: "回去", py: "huíqù", vi: "Đi về", pos: "verb", weight: 5 },
      { id: 66, zh: "回答", py: "huídá", vi: "Trả lời", pos: "verb", weight: 5 },

      { id: 67, zh: "因为", py: "yīnwèi", vi: "Bởi vì", pos: "conj", weight: 5 },
      { id: 68, zh: "国家", py: "guójiā", vi: "Quốc gia", pos: "noun", weight: 5 },
      { id: 69, zh: "地方", py: "dìfāng", vi: "Địa phương", pos: "noun", weight: 5 },

      { id: 70, zh: "报告", py: "bàogào", vi: "Báo cáo", pos: "noun", weight: 5 },
      { id: 71, zh: "外面", py: "wàimiàn", vi: "Bên ngoài", pos: "noun", weight: 5 },

      { id: 72, zh: "多少", py: "duōshǎo", vi: "Bao nhiêu", pos: "pronoun", weight: 5 },
      { id: 73, zh: "大家", py: "dàjiā", vi: "Mọi người", pos: "pronoun", weight: 5 },
      { id: 74, zh: "大概", py: "dàgài", vi: "Khoảng", pos: "adv", weight: 5 },

      { id: 75, zh: "奇怪", py: "qíguài", vi: "Kỳ lạ", pos: "adj", weight: 5 },
      { id: 76, zh: "女人", py: "nǚrén", vi: "Phụ nữ", pos: "noun", weight: 5 },
      { id: 77, zh: "女孩", py: "nǚhái", vi: "Cô gái", pos: "noun", weight: 5 },
      { id: 78, zh: "她们", py: "tāmen", vi: "Họ", pos: "pronoun", weight: 5 },

      { id: 79, zh: "如果", py: "rúguǒ", vi: "Nếu", pos: "conj", weight: 5 },
      { id: 80, zh: "如此", py: "rúcǐ", vi: "Như vậy", pos: "adv", weight: 5 },

      { id: 81, zh: "妈妈", py: "māmā", vi: "Mẹ", pos: "noun", weight: 5 },
      { id: 82, zh: "孩子", py: "háizi", vi: "Trẻ con", pos: "noun", weight: 5 },
      { id: 83, zh: "他们", py: "tāmen", vi: "Họ", pos: "pronoun", weight: 5 },

      { id: 84, zh: "安全", py: "ānquán", vi: "An toàn", pos: "adj", weight: 5 },
      { id: 85, zh: "安排", py: "ānpái", vi: "Sắp xếp", pos: "verb", weight: 5 },
      { id: 86, zh: "完成", py: "wánchéng", vi: "Hoàn thành", pos: "verb", weight: 5 },

      { id: 87, zh: "害怕", py: "hàipà", vi: "Sợ", pos: "verb", weight: 5 },
      { id: 88, zh: "家庭", py: "jiātíng", vi: "Gia đình", pos: "noun", weight: 5 },
      { id: 89, zh: "容易", py: "róngyì", vi: "Dễ", pos: "adj", weight: 5 },

      { id: 90, zh: "宝贝", py: "bǎobèi", vi: "Cục cưng", pos: "noun", weight: 5 },
      { id: 91, zh: "小姐", py: "xiǎojiě", vi: "Tiểu thư", pos: "noun", weight: 5 },
      { id: 92, zh: "小心", py: "xiǎoxīn", vi: "Cẩn thận", pos: "verb", weight: 5 },
      { id: 93, zh: "小时", py: "xiǎoshí", vi: "Giờ", pos: "noun", weight: 5 },

      { id: 94, zh: "就是", py: "jiùshì", vi: "Chính là", pos: "adv", weight: 5 },
      { id: 95, zh: "工作", py: "gōngzuò", vi: "Công việc", pos: "noun", weight: 5 },
      { id: 96, zh: "已经", py: "yǐjīng", vi: "Đã", pos: "adv", weight: 5 },

      { id: 97, zh: "希望", py: "xīwàng", vi: "Hy vọng", pos: "verb", weight: 5 },
      { id: 98, zh: "帮助", py: "bāngzhù", vi: "Giúp đỡ", pos: "verb", weight: 5 },
      { id: 99, zh: "年轻", py: "niánqīng", vi: "Trẻ", pos: "adj", weight: 5 },

      { id: 100, zh: "建议", py: "jiànyì", vi: "Đề xuất", pos: "noun", weight: 5 },
      { id: 101, zh: "弟弟", py: "dìdì", vi: "Em trai", pos: "noun", weight: 5 },
      { id: 102, zh: "很多", py: "hěnduō", vi: "Rất nhiều", pos: "adj", weight: 5 },
      { id: 103, zh: "很快", py: "hěn kuài", vi: "Rất nhanh", pos: "adv", weight: 5 },
      { id: 104, zh: "律师", py: "lǜshī", vi: "Luật sư", pos: "noun", weight: 5 }
    ]
  },
  {
    id: "deck_5",
    name: "HSK 1 Tổng hợp + Đại từ",
    words: [
      { id: 105, zh: "爱", py: "ài", vi: "Yêu", pos: "verb", weight: 5 },
      { id: 106, zh: "八", py: "bā", vi: "Tám", pos: "number", weight: 5 },
      { id: 107, zh: "爸爸", py: "bàba", vi: "Bố", pos: "noun", weight: 5 },
      { id: 108, zh: "杯子", py: "bēizi", vi: "Cốc", pos: "noun", weight: 5 },
      { id: 109, zh: "北京", py: "Běijīng", vi: "Bắc Kinh", pos: "noun", weight: 5 },
      { id: 110, zh: "本", py: "běn", vi: "Cuốn", pos: "classifier", weight: 5 },
      { id: 111, zh: "不", py: "bù", vi: "Không", pos: "adv", weight: 5 },
      { id: 112, zh: "吃", py: "chī", vi: "Ăn", pos: "verb", weight: 5 },
      { id: 113, zh: "打电话", py: "dǎ diànhuà", vi: "Gọi điện", pos: "verb", weight: 5 },
      { id: 114, zh: "大", py: "dà", vi: "To", pos: "adj", weight: 5 },

      { id: 115, zh: "的", py: "de", vi: "Của", pos: "particle", weight: 5 },
      { id: 116, zh: "点", py: "diǎn", vi: "Giờ", pos: "noun", weight: 5 },
      { id: 117, zh: "电脑", py: "diànnǎo", vi: "Máy tính", pos: "noun", weight: 5 },
      { id: 118, zh: "电影", py: "diànyǐng", vi: "Phim", pos: "noun", weight: 5 },
      { id: 119, zh: "东西", py: "dōngxī", vi: "Đồ", pos: "noun", weight: 5 },

      { id: 120, zh: "都", py: "dōu", vi: "Đều", pos: "adv", weight: 5 },
      { id: 121, zh: "读", py: "dú", vi: "Đọc", pos: "verb", weight: 5 },
      { id: 122, zh: "对不起", py: "duìbùqǐ", vi: "Xin lỗi", pos: "phrase", weight: 5 },
      { id: 123, zh: "多", py: "duō", vi: "Nhiều", pos: "adj", weight: 5 },
      { id: 124, zh: "多少", py: "duōshǎo", vi: "Bao nhiêu", pos: "question", weight: 5 },

      { id: 125, zh: "儿子", py: "érzi", vi: "Con trai", pos: "noun", weight: 5 },
      { id: 126, zh: "二", py: "èr", vi: "Hai", pos: "number", weight: 5 },
      { id: 127, zh: "飞机", py: "fēijī", vi: "Máy bay", pos: "noun", weight: 5 },
      { id: 128, zh: "分钟", py: "fēnzhōng", vi: "Phút", pos: "noun", weight: 5 },
      { id: 129, zh: "高兴", py: "gāoxìng", vi: "Vui", pos: "adj", weight: 5 },

      { id: 130, zh: "个", py: "gè", vi: "Cái", pos: "classifier", weight: 5 },
      { id: 131, zh: "工作", py: "gōngzuò", vi: "Công việc", pos: "noun", weight: 5 },
      { id: 132, zh: "狗", py: "gǒu", vi: "Chó", pos: "noun", weight: 5 },
      { id: 133, zh: "汉语", py: "Hànyǔ", vi: "Tiếng Trung", pos: "noun", weight: 5 },
      { id: 134, zh: "好", py: "hǎo", vi: "Tốt", pos: "adj", weight: 5 },

      { id: 135, zh: "喝", py: "hē", vi: "Uống", pos: "verb", weight: 5 },
      { id: 136, zh: "和", py: "hé", vi: "Và", pos: "conj", weight: 5 },
      { id: 137, zh: "很", py: "hěn", vi: "Rất", pos: "adv", weight: 5 },
      { id: 138, zh: "回", py: "huí", vi: "Về", pos: "verb", weight: 5 },
      { id: 139, zh: "会", py: "huì", vi: "Biết / sẽ", pos: "aux", weight: 5 },

      { id: 140, zh: "家", py: "jiā", vi: "Nhà", pos: "noun", weight: 5 },
      { id: 141, zh: "叫", py: "jiào", vi: "Gọi", pos: "verb", weight: 5 },
      { id: 142, zh: "今天", py: "jīntiān", vi: "Hôm nay", pos: "noun", weight: 5 },
      { id: 143, zh: "开", py: "kāi", vi: "Mở", pos: "verb", weight: 5 },
      { id: 144, zh: "看", py: "kàn", vi: "Xem", pos: "verb", weight: 5 },

      { id: 145, zh: "老师", py: "lǎoshī", vi: "Giáo viên", pos: "noun", weight: 5 },
      { id: 146, zh: "了", py: "le", vi: "Đã", pos: "particle", weight: 5 },
      { id: 147, zh: "冷", py: "lěng", vi: "Lạnh", pos: "adj", weight: 5 },
      { id: 148, zh: "里", py: "lǐ", vi: "Trong", pos: "noun", weight: 5 },
      { id: 149, zh: "六", py: "liù", vi: "Sáu", pos: "number", weight: 5 },

      { id: 150, zh: "妈妈", py: "māma", vi: "Mẹ", pos: "noun", weight: 5 },
      { id: 151, zh: "吗", py: "ma", vi: "Không (hỏi)", pos: "particle", weight: 5 },
      { id: 152, zh: "买", py: "mǎi", vi: "Mua", pos: "verb", weight: 5 },
      { id: 153, zh: "猫", py: "māo", vi: "Mèo", pos: "noun", weight: 5 },
      { id: 154, zh: "没", py: "méi", vi: "Chưa", pos: "adv", weight: 5 },

      { id: 155, zh: "名字", py: "míngzi", vi: "Tên", pos: "noun", weight: 5 },
      { id: 156, zh: "哪", py: "nǎ", vi: "Nào", pos: "pronoun", weight: 5 },
      { id: 157, zh: "哪里", py: "nǎlǐ", vi: "Ở đâu", pos: "pronoun", weight: 5 },
      { id: 158, zh: "你", py: "nǐ", vi: "Bạn", pos: "pronoun", weight: 5 },
      { id: 159, zh: "年", py: "nián", vi: "Năm", pos: "noun", weight: 5 },

      { id: 160, zh: "朋友", py: "péngyou", vi: "Bạn", pos: "noun", weight: 5 },
      { id: 161, zh: "漂亮", py: "piàoliang", vi: "Đẹp", pos: "adj", weight: 5 },
      { id: 162, zh: "苹果", py: "píngguǒ", vi: "Táo", pos: "noun", weight: 5 },
      { id: 163, zh: "去", py: "qù", vi: "Đi", pos: "verb", weight: 5 },
      { id: 164, zh: "人", py: "rén", vi: "Người", pos: "noun", weight: 5 },

      { id: 165, zh: "认识", py: "rènshi", vi: "Quen biết", pos: "verb", weight: 5 },
      { id: 166, zh: "三", py: "sān", vi: "Ba", pos: "number", weight: 5 },
      { id: 167, zh: "谁", py: "shuí", vi: "Ai", pos: "pronoun", weight: 5 },
      { id: 168, zh: "什么", py: "shénme", vi: "Cái gì", pos: "pronoun", weight: 5 },
      { id: 169, zh: "十", py: "shí", vi: "Mười", pos: "number", weight: 5 },

      { id: 170, zh: "是", py: "shì", vi: "Là", pos: "verb", weight: 5 },
      { id: 171, zh: "书", py: "shū", vi: "Sách", pos: "noun", weight: 5 },
      { id: 172, zh: "水", py: "shuǐ", vi: "Nước", pos: "noun", weight: 5 },
      { id: 173, zh: "睡觉", py: "shuìjiào", vi: "Ngủ", pos: "verb", weight: 5 },
      { id: 174, zh: "说话", py: "shuōhuà", vi: "Nói chuyện", pos: "verb", weight: 5 },

      { id: 175, zh: "四", py: "sì", vi: "Bốn", pos: "number", weight: 5 },
      { id: 176, zh: "他", py: "tā", vi: "Anh ấy", pos: "pronoun", weight: 5 },
      { id: 177, zh: "她", py: "tā", vi: "Cô ấy", pos: "pronoun", weight: 5 },
      { id: 178, zh: "太", py: "tài", vi: "Quá", pos: "adv", weight: 5 },
      { id: 179, zh: "天气", py: "tiānqì", vi: "Thời tiết", pos: "noun", weight: 5 },

      { id: 180, zh: "听", py: "tīng", vi: "Nghe", pos: "verb", weight: 5 },
      { id: 181, zh: "同学", py: "tóngxué", vi: "Bạn học", pos: "noun", weight: 5 },
      { id: 182, zh: "我", py: "wǒ", vi: "Tôi", pos: "pronoun", weight: 5 },
      { id: 183, zh: "我们", py: "wǒmen", vi: "Chúng tôi", pos: "pronoun", weight: 5 },
      { id: 184, zh: "五", py: "wǔ", vi: "Năm", pos: "number", weight: 5 },

      { id: 185, zh: "喜欢", py: "xǐhuān", vi: "Thích", pos: "verb", weight: 5 },
      { id: 186, zh: "下", py: "xià", vi: "Xuống", pos: "verb", weight: 5 },
      { id: 187, zh: "现在", py: "xiànzài", vi: "Bây giờ", pos: "noun", weight: 5 },
      { id: 188, zh: "想", py: "xiǎng", vi: "Muốn", pos: "verb", weight: 5 },
      { id: 189, zh: "小", py: "xiǎo", vi: "Nhỏ", pos: "adj", weight: 5 },

      { id: 190, zh: "写", py: "xiě", vi: "Viết", pos: "verb", weight: 5 },
      { id: 191, zh: "谢谢", py: "xièxiè", vi: "Cảm ơn", pos: "phrase", weight: 5 },
      { id: 192, zh: "学生", py: "xuéshēng", vi: "Học sinh", pos: "noun", weight: 5 },
      { id: 193, zh: "学习", py: "xuéxí", vi: "Học", pos: "verb", weight: 5 },
      { id: 194, zh: "学校", py: "xuéxiào", vi: "Trường học", pos: "noun", weight: 5 },

      { id: 195, zh: "一", py: "yī", vi: "Một", pos: "number", weight: 5 },
      { id: 196, zh: "衣服", py: "yīfu", vi: "Quần áo", pos: "noun", weight: 5 },
      { id: 197, zh: "医生", py: "yīshēng", vi: "Bác sĩ", pos: "noun", weight: 5 },
      { id: 198, zh: "在", py: "zài", vi: "Ở", pos: "verb", weight: 5 },
      { id: 199, zh: "再见", py: "zàijiàn", vi: "Tạm biệt", pos: "phrase", weight: 5 },

      { id: 200, zh: "怎么", py: "zěnme", vi: "Sao", pos: "question", weight: 5 },
      { id: 201, zh: "这", py: "zhè", vi: "Này", pos: "pronoun", weight: 5 },
      { id: 202, zh: "中国", py: "Zhōngguó", vi: "Trung Quốc", pos: "noun", weight: 5 },
      { id: 203, zh: "中午", py: "zhōngwǔ", vi: "Trưa", pos: "noun", weight: 5 },
      { id: 204, zh: "住", py: "zhù", vi: "Sống", pos: "verb", weight: 5 }
    ]
  }
];