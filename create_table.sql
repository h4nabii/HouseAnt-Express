-- 创建数据库
create database if not exists house_ant;

-- 切换数据库
use house_ant;

-- 用户表
create table if not exists user
(
    id         bigint auto_increment comment '用户ID',
    username   varchar(512)                          not null comment '用户名称',
    password   varchar(512)                          not null comment '用户密码',
    avatarUrl  varchar(1024)                         null comment '用户头像URL',
    access     varchar(64) default 'user'            not null comment '用户角色权限',
    createTime datetime    default current_timestamp not null comment '创建时间',
    updateTime datetime    default current_timestamp not null on update current_timestamp comment '更新时间',
    constraint user_pk
        primary key (id),
    constraint user_pk_username
        unique (username)
) comment '用户表' collate = utf8mb3_unicode_ci;

-- 房屋表
create table if not exists houseSrc
(
    id         bigint auto_increment comment '房屋ID',
    userId     bigint                             not null comment '房主ID',
    name       varchar(512)                       not null comment '房屋名称',
    address    varchar(512)                       not null comment '房屋地址',
    price      float                              not null comment '房屋价格',
    details    text                               null comment '房屋描述',
    area       float                              null comment '房屋面积',
    picture    varchar(1024)                      null comment '房屋图片',
    createTime datetime default current_timestamp not null comment '创建时间',
    updateTime datetime default current_timestamp not null on update current_timestamp comment '更新时间',
    constraint houseSrc_pk
        primary key (id),
    constraint houseSrc_user_id_fk
        foreign key (userId) references user (id)
) comment '房屋表' collate = utf8mb3_unicode_ci;

-- 预约表
create table if not exists reservation
(
    id         bigint auto_increment comment '预约ID'
        primary key,
    userId     bigint                             not null comment '顾客ID',
    houseId    bigint                             not null comment '房屋ID',
    startDate  date                               not null comment '开始日期',
    endDate    date                               not null comment '结束日期',
    status     varchar(64)                        not null comment '预约状态',
    details    text                               null comment '预约细节',
    createTime datetime default CURRENT_TIMESTAMP not null comment '创建时间',
    updateTime datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP comment '更新时间',
    constraint reservation_houseSrc_id_fk
        foreign key (houseId) references houseSrc (id),
    constraint reservation_user_id_fk
        foreign key (userId) references user (id)
) comment '预约表' collate = utf8mb3_unicode_ci;
