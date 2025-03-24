-- Insert data into Role table
INSERT INTO Role (RoleId, RoleName, Status) VALUES
('6FE9AD54-E317-4356-959B-BEDA433D0097', 'Admin', 1),
('22BB4045-38B3-4B15-B523-348ABF832EB8', 'User', 1),
('28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4', 'Event Organizer', 1),
('ECEDF9DF-DB0E-46A5-B150-870C634E5DBB', 'Staff', 1);

-- Insert data into User table
INSERT INTO [User] (UserId, FullName, Email, Password, RoleId, Status, CreatedAt) VALUES
('D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', 'Nguyen Van A', 'nguyenvana@example.com', 'password123', '22BB4045-38B3-4B15-B523-348ABF832EB8', 1, GETDATE()),
('9D0EB9A4-9810-4B29-B952-515BF39050EC', 'Tran Thi B', 'tranthib@example.com', 'password123', '6FE9AD54-E317-4356-959B-BEDA433D0097', 1, GETDATE()),
('BC487D14-7503-4451-AFD3-A3FB286F59F0', 'Le Van C', 'levanc@example.com', 'password123', '28A1F3F0-B5E8-4C5F-9DA8-8F61C351C1B4', 1, GETDATE());

-- Insert data into Wallet table
INSERT INTO Wallet (WalletId, UserId, Balance) VALUES
('E5B56B75-CB6F-4059-AA6C-59110A940035', 'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', 100000),
('94CD3445-2BA0-4741-8172-AFBCEFD73177', '9D0EB9A4-9810-4B29-B952-515BF39050EC', 50000),
('D1A3119B-85A6-4D0A-969A-52F8AF3D0EE5', 'BC487D14-7503-4451-AFD3-A3FB286F59F0', 200000);

-- Insert data into Events table
INSERT INTO Events (EventId, Name, Place, CreatedAt, UserId, TimeStart, TimeEnd, Type, Status) VALUES
('79681739-E09E-4089-AB05-7A1D2C8045C1', 'Music Festival', 'Hanoi', GETDATE(), 'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', '2025-05-01', '2025-05-02', 1, 1),
('64203353-507B-4235-BB40-DD813D8CD860', 'Tech Meetup', 'Ho Chi Minh City', GETDATE(), '9D0EB9A4-9810-4B29-B952-515BF39050EC', '2025-06-10', '2025-06-11', 2, 1),
('10F8EEA1-C2AC-439F-99CC-3B7E2194A518', 'Startup Pitch', 'Da Nang', GETDATE(), 'BC487D14-7503-4451-AFD3-A3FB286F59F0', '2025-07-15', '2025-07-16', 3, 1);

-- Insert data into Posts table
INSERT INTO Posts (PostId, EventId, UserId, CreatedAt, Title, Content, Type, Status) VALUES
('853D0E79-B3B1-4823-8ED9-6C66B5F36AEF', '79681739-E09E-4089-AB05-7A1D2C8045C1', 'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', GETDATE(), 'Amazing Event!', 'Join us for a great time!', 1, 1),
('D080E5CA-FF70-4936-9F4C-03AEBF90281B', '64203353-507B-4235-BB40-DD813D8CD860', '9D0EB9A4-9810-4B29-B952-515BF39050EC', GETDATE(), 'Tech Innovations', 'Discussing the latest in AI and ML', 2, 1),
('85DD0F81-0591-48E3-818D-6CB467DD5A2B', '10F8EEA1-C2AC-439F-99CC-3B7E2194A518', 'BC487D14-7503-4451-AFD3-A3FB286F59F0', GETDATE(), 'Startup Pitches', 'Exciting ideas and ventures', 3, 1);

-- Insert data into Groups table
INSERT INTO Groups (GroupId, GroupName, CreatedAt, EventId, TotalMember, Leader, Visibility, Status,Currency) VALUES
('AC606ACD-2827-455E-9510-65992299CA60', 'Developers Group', GETDATE(), '64203353-507B-4235-BB40-DD813D8CD860', 10, '9D0EB9A4-9810-4B29-B952-515BF39050EC', 1, 1,'VND'),
('8A510F6D-1A9D-4C6A-8885-B1D6A1DF7EFC', 'Music Lovers', GETDATE(), '79681739-E09E-4089-AB05-7A1D2C8045C1', 15, 'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', 1, 1,'VND'),
('B7BCABF2-5338-4F07-90C2-7DD42C666B35', 'Startup Enthusiasts', GETDATE(), '10F8EEA1-C2AC-439F-99CC-3B7E2194A518', 8, 'BC487D14-7503-4451-AFD3-A3FB286F59F0', 1, 1,'VND');

--insert plan
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'29db8362-57d2-4b32-81ba-14c5d6c169d7', N'lalali23', N'yes sure', CAST(N'2025-03-05T21:09:00.0000000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'5f57ac43-1d9c-4210-adb6-2f3b5c055f3f', N'long day 3', N'dâdwa', CAST(N'2025-02-27T11:33:00.0000000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'06d787f6-82e3-4d1c-a01b-587ab7ac403c', N'ccccccccc', N'ccc', CAST(N'2025-02-26T17:41:00.0000000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'7a044d84-2d32-4e6a-aa1e-727db02b7a3a', N'dawdadaw', N'dwadwa', CAST(N'2025-03-05T21:31:00.0000000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 2)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'12c42dcf-d896-4a48-bb79-a5f87508e0f5', N'long day 2', N'long day no see', CAST(N'2025-03-05T11:34:00.0000000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'20a4887d-c8bd-4ae3-af8e-d519f2ac95f2', N'long day', N'long day', CAST(N'2025-03-12T11:04:03.4930000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Plans] ([PlanId], [Title], [Description], [Schedule], [GroupId], [Status]) VALUES (N'9632b0d9-e3de-416a-b4ab-d581efe56601', N'chuyen di vui choi', N'long time no see', CAST(N'2025-03-10T11:18:47.7570000' AS DateTime2), N'ac606acd-2827-455e-9510-65992299ca60', 1)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'0a8275b9-ab75-4a3b-a628-22d0a11f6d38', N'29db8362-57d2-4b32-81ba-14c5d6c169d7', N'hotel lunchtime', CAST(N'2025-03-12T19:36:00.0000000' AS DateTime2), CAST(N'2025-03-12T16:39:07.8506096' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'lol', 2)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'b9d1c604-b46a-4c9a-9937-522f358041e1', N'29db8362-57d2-4b32-81ba-14c5d6c169d7', N'hotel check out', CAST(N'2025-03-12T16:36:39.8930000' AS DateTime2), CAST(N'2025-03-12T16:39:00.5740904' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'lol', 1)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'abe2c1ec-1e3d-4af7-9b5d-744cf31fd8a4', N'29db8362-57d2-4b32-81ba-14c5d6c169d7', N'hotel dinner time', CAST(N'2025-03-12T16:36:39.8930000' AS DateTime2), CAST(N'2025-03-12T16:39:16.2837804' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'lol', 1)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'53f0a97f-8704-42ac-b1e4-769395283f7c', N'29db8362-57d2-4b32-81ba-14c5d6c169d7', N'hotel check out', CAST(N'2025-03-05T14:31:00.0000000' AS DateTime2), CAST(N'2025-03-15T07:28:58.6662320' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'hotel', 1)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'c3f37c3d-e8a8-41bb-b36c-b55ecd75ef93', N'06d787f6-82e3-4d1c-a01b-587ab7ac403c', N'ccc', CAST(N'2025-02-26T17:39:00.0000000' AS DateTime2), CAST(N'2025-03-14T10:37:22.3900180' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'ccc', 2)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'a71543c4-d764-4c6f-9e2b-bed9c8f2d5b2', N'7a044d84-2d32-4e6a-aa1e-727db02b7a3a', N'dawdwa234', CAST(N'2025-03-05T21:37:00.0000000' AS DateTime2), CAST(N'2025-03-13T14:31:26.5833512' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'dwadaw222', 1)
GO
INSERT [dbo].[Activity] ([ActivityId], [PlanId], [Content], [Schedule], [CreatedAt], [CreatedBy], [Category], [Status]) VALUES (N'a800d81b-e940-4741-8e2b-c362340a2fca', N'7a044d84-2d32-4e6a-aa1e-727db02b7a3a', N'12312321', CAST(N'2025-03-05T21:36:00.0000000' AS DateTime2), CAST(N'2025-03-13T14:31:20.7095338' AS DateTime2), N'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2', N'dawda321312', 1)
GO
--user-group
INSERT INTO [dbo].[User_Group]
           ([UsergroupId]
           ,[UserId]
           ,[GroupId])
     VALUES(NEWID()
           ,'D39BF95E-E6C3-41A6-94B1-DF92AACE83A2'
           ,'AC606ACD-2827-455E-9510-65992299CA60')
           ,(NEWID()
           ,'BC487D14-7503-4451-AFD3-A3FB286F59F0'
           ,'AC606ACD-2827-455E-9510-65992299CA60')
           ,(NEWID()
           ,'9D0EB9A4-9810-4B29-B952-515BF39050EC'
           ,'AC606ACD-2827-455E-9510-65992299CA60')

select* from [Conversations]
		   
INSERT INTO [dbo].[Conversations]
           ([Id]
           ,[Img]
           ,[Name]
           ,[GroupId]
           ,[Type]
           ,[CreatedBy]
           ,[CreatedAt]
           ,[Status])
     VALUES
           (NEWID(),  -- T?o ID m?i t? d?ng
           N'https://example.com/default.jpg', -- Link ?nh m?c d?nh
           N'Nhóm Event',  -- Tên nhóm
           'AC606ACD-2827-455E-9510-65992299CA60', -- GroupId 
           1,  -- Lo?i nhóm (1 = Nhóm chung, có th? thay d?i theo h? th?ng)
           'C121C20B-9250-49D6-B717-08DD5FE7368D', -- CreatedBy (User Id)
           GETDATE(),  -- Th?i gian t?o
           1)  -- Tr?ng thái (1 = Ho?t d?ng, có th? thay d?i)
GO


INSERT INTO [dbo].[User_Conversation]
           ([UserconversationId]
           ,[UserId]
           ,[ConversationId])
     VALUES
           (NEWID(),  -- T?o ID m?i t? d?ng
           'C121C20B-9250-49D6-B717-08DD5FE7368D', -- UserId (Ngu?i dùng tham gia)
           'ED50CE33-C8DD-42C2-B39A-1034107417E5') -- ConversationId (Cu?c h?i tho?i)
GO
