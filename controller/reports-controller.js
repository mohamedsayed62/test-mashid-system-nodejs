const student = require('../models/student');
const user = require('../models/user');
const Attendance = require('../models/attendance');
const ExcelJS = require("exceljs")
const asyncMiddleware = require('../middleware/async-middleware');
const { validationResult } = require('express-validator');
const errorHandler = require('../utils/error-handler');


const showReports = asyncMiddleware(async (req, res, next) => {

  const [year, month, day] = req.body.day.split("-").map(Number);

  const startOfDay = new Date(
    Date.UTC(year, month - 1, day)
  );

  const endOfDay = new Date(
    Date.UTC(year, month - 1, day + 1)
  );

  const getStudents = await student.find({ userId: req.body.userId });

  const studentsIds = getStudents.map(s => s._id);
  const attendanceStats = await Attendance.aggregate([
    {
      $match: {
        student_id: { $in: studentsIds },
        day: {
          $gte: startOfDay,
          $lt: endOfDay
        }
      }
    },
    {
      $group: {
        _id: "$attend",
        count: { $sum: 1 }
      }
    }
  ]);

  const counts = {
    present: 0,
    absent: 0,
    late: 0,
    excused: 0
  };

  attendanceStats.forEach(item => {
    counts[item._id] = item.count;
  });

  const total =
    counts.present +
    counts.absent +
    counts.late +
    counts.excused;

  const percentages = {
    present: total ? (counts.present / total) * 100 : 0,
    absent: total ? (counts.absent / total) * 100 : 0,
    late: total ? (counts.late / total) * 100 : 0,
    excused: total ? (counts.excused / total) * 100 : 0
  };

  if (!studentsIds || studentsIds.length == 0) {
    const Handler = new errorHandler('Fail', 'لا يوجد طلبة', 400);
    return next(Handler);
  }
  res.json({ status: 'success', message: 'تم استرجاع البيانات بنجاح', code: 200, data: percentages });
});

const downloadExcel = asyncMiddleware(async (req, res, next) => {
  try {
    const startOfDay = new Date(req.body.day);
    startOfDay.setUTCHours(0, 0, 0, 0);
  
    const endOfDay = new Date(startOfDay);
    endOfDay.setUTCDate(endOfDay.getUTCDate() + 1);
    const getStudents = await student.find({ userId: req.body.userId });
    const studentsIds = getStudents.map(s => s._id);
    const convertDay = new Date(req.body.day);

    const attendance = await Attendance.find({
    student_id: { $in: studentsIds },
    day: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  }).populate("student_id");

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`تقرير - ${req.body.day}`);

    worksheet.columns = [
      { header: "الاسم", key: "name", width: 30 },
      { header: "رقم الهاتف", key: "phone", width: 20 },
      { header: "الحضور", key: "attend", width: 20 },
    ];

    attendance.forEach((attend) => {
      let attendStatus = 'حاضر'
      if (attend['attend'] == 'absent') {
        attendStatus = 'غائب'
      } else if (attend['attend'] == 'late') {
        attendStatus = 'متأخر'
      } else if(attend['attend'] == 'excused') {
        attendStatus = 'بعذر'
      }
      worksheet.addRow({
        name: attend['student_id'].name,
        phone: attend['student_id'].phone_number,
        attend: attendStatus

      });
    });

        // Header styling
    worksheet.getRow(1).font = {
      bold: true,
      color: { argb: "FFFFFF" },
    };

    worksheet.getRow(1).fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "0B1D3A" },
    };

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=attendance-${req.body.day}.xlsx`
    );

    const buffer = await workbook.xlsx.writeBuffer();

    // Send Buffer
    return res.status(200).send(buffer);

  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Failed to export data",
    });
  }
})


module.exports = {showReports, downloadExcel};