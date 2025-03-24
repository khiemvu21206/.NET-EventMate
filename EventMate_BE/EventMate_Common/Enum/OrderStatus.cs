using System.ComponentModel;

namespace EventMate_Common.Status;
public enum OrderStatus
{
    WaitingForApproval,
	Accepted,
	InTransit,
	Rejected,
	Delivered,
	Completed
}
