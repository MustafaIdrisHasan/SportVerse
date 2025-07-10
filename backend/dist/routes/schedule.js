"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const scheduleController_1 = require("../controllers/scheduleController");
const router = (0, express_1.Router)();
router.get('/:sport', scheduleController_1.ScheduleController.getSchedule);
router.get('/', scheduleController_1.ScheduleController.getAllSchedules);
router.get('/upcoming', scheduleController_1.ScheduleController.getUpcomingEvents);
exports.default = router;
//# sourceMappingURL=schedule.js.map