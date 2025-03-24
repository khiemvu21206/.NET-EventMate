using System.ComponentModel;

namespace EventMate_Common.Status;
public enum EventStatus
{
	Pending,    // Đang chờ duyệt
	Approved,   // Đã duyệt
	Published,  // Đã công khai
	Ongoing,    // Đang diễn ra
	Completed,  // Đã hoàn thành
	Cancelled,  // Đã hủy
	Archived    // Đã lưu trữ
}
