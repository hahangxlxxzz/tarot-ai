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
        "send": "Send"
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
        "subtitle": "Tìm Kiếm Sự Thật"
      },
      "nav": {
        "ritual": "Nghi Lễ Cá Nhân",
        "archive": "Kho Lưu Trữ",
        "settings": "Cài Đặt",
        "past_journeys": "Hành Trình Quá Khứ",
        "auth_required": "Yêu Cầu Đăng Nhập",
        "empty_journal": "Nhật ký của bạn đang trống. Hãy bắt đầu một nghi lễ để lưu trữ."
      },
      "reading": {
        "draw_button": "Rút bài",
        "chat_button": "Trò chuyện với Oracle",
        "ask": "Hỏi Khởi Thế",
        "reset": "Đặt Lại",
        "question_placeholder": "Hành trình nào bạn đang dấn thân vào?",
        "insight_title": "Thấu Hiểu & Chỉ Dẫn",
        "oracle_interpretation": "Lời Giải Từ Oracle",
        "journal_entry": "Lưu Nhật Ký",
        "journal_saved": "Ký ức vũ trụ đã được lưu giữ.",
        "silence": "Sự im lặng trước cơn bão...",
        "analyzing": "Tần số đang dịch chuyển...",
        "status": {
          "spread": "Trải bài",
          "phase": "Giai Đoạn Nghi Lễ",
          "quiet": "Phản Chiếu Tĩnh Lặng",
          "ascending": "Đang Kết Nối AI...",
          "shuffling": "Đang xáo trộn bộ bài...",
          "dealing": "Đang dàn trận bài..."
        }
      },
      "chat": {
        "title": "Đối Thoại Oracle",
        "placeholder": "Hỏi sâu hơn về lá bài...",
        "send": "Gửi"
      },
      "spreads": {
        "daily": "Lời Khuyên Hằng Ngày",
        "three": "Hành Trình Ba Lá",
        "celtic": "Trải Bài Thập Tự",
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
