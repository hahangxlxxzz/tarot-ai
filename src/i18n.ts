import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "app": {
        "title": "Aetheria Oracle",
        "subtitle": "Seek Your Truth"
      },
      "nav": {
        "ritual": "The Special Ritual",
        "archive": "Journal Archive",
        "settings": "Settings",
        "guide": "Guide",
        "past_journeys": "Past Journeys",
        "auth_required": "Authentication Required",
        "empty_journal": "Your journal is empty. Start a ritual to begin your archive."
      },
      "reading": {
        "draw_button": "Draw Cards",
        "chat_button": "Converse with Oracle",
        "ask": "Ask Oracle",
        "reset": "Reset",
        "question_placeholder": "What journey are you embarking on?",
        "insight_title": "Insight & Guidance",
        "oracle_interpretation": "Oracle Interpretation",
        "journal_entry": "Save to Journal",
        "journal_saved": "The cosmic memory is preserved.",
        "silence": "Silence before the storm...",
        "analyzing": "The vibrations are shifting...",
        "spiritual_journey": "Spiritual Journey",
        "guiding_path": "What is guiding your path today?",
        "invoking_will": "Invoking Cosmic Will",
        "spiritual_currents": "The spiritual currents are guiding us...",
        "error_resting": "Sorry, the Oracle is resting. Please try again later.",
        "error_connecting": "Sorry, I encountered an error connecting to the Oracle.",
        "status": {
          "spread": "Spread",
          "phase": "Ritual Phase",
          "quiet": "Quiet Reflection",
          "ascending": "AI Channeling...",
          "shuffling": "Shuffling sacred deck...",
          "dealing": "Dealing into position..."
        }
      },
      "chat": {
        "title": "Oracle Dialogue",
        "placeholder": "Ask the cards further...",
        "send": "Send",
        "welcome": "Ask me anything...",
        "error": "Very sorry, there was an error connecting to the Oracle."
      },
      "settings": {
        "clear_cache": "Clear Cache",
        "clear_confirm": "Are you sure you want to clear all settings?",
        "clear": "Clear",
        "cancel": "Cancel"
      },
      "guide": {
        "title": "Messenger Guide",
        "step1_title": "1. Initiation",
        "step1_desc": "Enter your question or what is on your mind in the input field. Then press the 'Draw Cards' or 'Ask Oracle' button.",
        "step2_title": "2. Ritual",
        "step2_desc": "The cards will be shuffled and spread according to your chosen layout. Focus on your question during this time.",
        "step3_title": "3. Interpretation",
        "step3_desc": "The Oracle will analyze the cards and provide an interpretation. You can save it to your Journal if you are signed in.",
        "step4_title": "4. Conversation",
        "step4_desc": "Use the message icon in the bottom right corner to further converse with the Oracle about the reading or anything you wish.",
        "understood": "Understood"
      },
      "spreads": {
        "daily": "Daily Oracle",
        "three": "Path of Three",
        "celtic": "Celtic Cross",
        "custom": "Mystical Inquiry"
      }
    }
  },
  vi: {
    translation: {
      "app": {
        "title": "Aetheria Oracle",
        "subtitle": "Giải Mã Vận Mệnh"
      },
      "nav": {
        "ritual": "Nghi Thức Huyền Bí",
        "archive": "Nhật Ký Hành Trình",
        "settings": "Thiết Lập",
        "guide": "Hướng Dẫn",
        "past_journeys": "Những Cuộc Hành Trình Đã Qua",
        "auth_required": "Yêu Cầu Kết Nối",
        "empty_journal": "Nhật ký của bạn chưa có ký ức nào. Hãy bắt đầu một nghi thức ngay."
      },
      "reading": {
        "draw_button": "Bắt Đầu Rút Bài",
        "chat_button": "Hỏi Ý Nhà Tiên Tri",
        "ask": "Hỏi Nhà Tiên Tri",
        "reset": "Làm Mới",
        "question_placeholder": "Vấn đề nào đang chờ bạn khám phá?",
        "insight_title": "Thấu Hiểu & Chỉ Dẫn",
        "oracle_interpretation": "Lời Giải Từ Nhà Tiên Tri",
        "journal_entry": "Lưu Vào Nhật Ký",
        "journal_saved": "Ký ức vũ trụ đã được lưu giữ.",
        "silence": "Tĩnh lặng trước khi thông điệp hé lộ...",
        "analyzing": "Năng lượng đang luân chuyển...",
        "spiritual_journey": "HÀNH TRÌNH TÂM LINH",
        "guiding_path": "Điều gì đang dẫn lối bước chân bạn?",
        "invoking_will": "KHỞI TẠO Ý CHÍ VŨ TRỤ",
        "spiritual_currents": "Dòng chảy tâm linh đang dẫn lối...",
        "error_resting": "Xin lỗi, Nhà Tiên Tri đang tạm nghỉ. Vui lòng thử lại sau.",
        "error_connecting": "Rất tiếc, đã có lỗi khi kết nối với Nhà Tiên Tri.",
        "status": {
          "spread": "Sơ đồ trải bài",
          "phase": "Giai Đoạn Nghi Thức",
          "quiet": "Tâm Thế Tĩnh Lặng",
          "ascending": "Lời tiên tri đang dần hé lộ...",
          "shuffling": "Đang xáo trộn các lá bài...",
          "dealing": "Các lá bài đang vào vị trí..."
        }
      },
      "chat": {
        "title": "Trò Chuyện Cùng Nhà Tiên Tri",
        "placeholder": "Hỏi sâu hơn về thông điệp này...",
        "send": "Gửi",
        "welcome": "Hãy hỏi tôi bất cứ điều gì...",
        "error": "Rất tiếc, đã có lỗi khi kết nối với Nhà Tiên Tri."
      },
      "settings": {
        "clear_cache": "Xóa Bộ Nhớ Tạm",
        "clear_confirm": "Bạn chắc chắn muốn xóa mọi dữ liệu cài đặt?",
        "clear": "Xóa",
        "cancel": "Hủy"
      },
      "guide": {
        "title": "Hướng Dẫn Sứ Giả",
        "step1_title": "1. Khởi Đầu",
        "step1_desc": "Nhập câu hỏi của bạn hoặc điều bạn đang băn khoăn vào ô nhập liệu. Sau đó nhấn nút 'Bắt Đầu Rút Bài' hoặc 'Hỏi Nhà Tiên Tri'.",
        "step2_title": "2. Nghi Thức",
        "step2_desc": "Các lá bài sẽ được xáo và trải ra theo sơ đồ bạn đã chọn. Hãy tập trung vào câu hỏi của mình trong lúc này.",
        "step3_title": "3. Lời Giải",
        "step3_desc": "Nhà Tiên Tri sẽ phân tích các lá bài và đưa ra lời giải đáp. Bạn có thể lưu lại vào Nhật Ký nếu đã đăng nhập.",
        "step4_title": "4. Trò Chuyện",
        "step4_desc": "Sử dụng biểu tượng tin nhắn ở góc dưới bên phải để trò chuyện thêm với Nhà Tiên Tri về trải bài hoặc bất cứ điều gì bạn muốn.",
        "understood": "Đã Hiểu"
      },
      "spreads": {
        "daily": "Thông Điệp Ngày Mới",
        "three": "Dòng Thời Gian",
        "celtic": "Trải Bài Celtic Cross",
        "custom": "Truy Vấn Huyền Bí"
      }
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
