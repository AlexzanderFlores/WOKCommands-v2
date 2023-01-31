"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ConfigType;
(function (ConfigType) {
    // userIds
    ConfigType["SERVER_OWNER_ID"] = "server-owner-id";
    // ateam roleIds
    ConfigType["ROLE_ID_MAIN_SERVANT"] = "main-servant-role-id";
    ConfigType["SERVANT_ROLE_ID"] = "servant-role-id";
    ConfigType["GARDENER_ROLE_ID"] = "gardener-role-id";
    ConfigType["GRIM_ROLE_ID"] = "grim-reaper-role-id";
    ConfigType["ATEAM_ROLE_ID"] = "ateam-role-id";
    // helper roleIds
    ConfigType["HEAD_OF_HELPER_ROLE_ID"] = "head-of-helper-role-id";
    ConfigType["HELPER_ROLE_ID"] = "helper-role-id";
    ConfigType["SPEAKER_ROLE_ID"] = "speaker-role-id";
    ConfigType["NARRATOR_ROLE_ID"] = "narrator-role-id";
    ConfigType["POLE_ROLE_ID"] = "pole-role-id";
    // other roleIds
    ConfigType["VERIFIED_ROLE_ID"] = "verified-role-id";
    ConfigType["UNVERIFIED_ROLE_ID"] = "unverified-role-id";
    ConfigType["ARISTOCRAT_ROLE_ID"] = "aristocrat-of-evil-role-id";
    ConfigType["NEWS_NOTIFICATION_ROLE_ID"] = "news-role-id";
    ConfigType["SCHEDULE_EVENT_NOTIFICATION_ROLE_ID"] = "schedule-event-role-id";
    ConfigType["EVENT_NOTIFICATION_ROLE_ID"] = "events-role-id";
    ConfigType["IDEAS_NOTIFICATION_ROLE_ID"] = "ideas-role-id";
    // log channelIds
    ConfigType["LOG_DEFAULT_CHANNEL_ID"] = "log-default-channel-id";
    ConfigType["LOG_TRIGGERED_CMD_CHANNEL_ID"] = "log-triggered-cmd-channel-id";
    ConfigType["LOG_TEST_CHANNEL_ID"] = "log-test-channel-id";
    // ateam channelIds
    ConfigType["HELPDESK_CHANNEL_ID"] = "helpdesk-channel-id";
    ConfigType["AT_NEWS_CHANNEL_ID"] = "at-news-channel-id";
    ConfigType["MAIN_SERVANTS_CHANNEL_ID"] = "main-servants-channel-id";
    ConfigType["SERVANTS_CHANNEL_ID"] = "servants-channel-id";
    ConfigType["SERVANTS_VOICE_CHANNEL_ID"] = "servants-voice-channel-id";
    ConfigType["GARDENER_CHANNEL_ID"] = "gardener-channel-id";
    ConfigType["GRIM_CHANNEL_ID"] = "grim-reaper-channel-id";
    ConfigType["ATEAM_CHANNEL_ID"] = "ateam-channel-id";
    // other channelIds
    ConfigType["STAGE_CHANNEL_ID"] = "stage-channel-id";
    ConfigType["GENERAL_CHANNEL_ID"] = "general-channel-id";
    ConfigType["NOTICE_BOARD_CHANNEL_ID"] = "notice-board-channel-id";
})(ConfigType || (ConfigType = {}));
exports.default = ConfigType;
// Todo: automaticky importovat init v config cmd
