/*
 * @Author: ShawnPhang
 * @Date: 2021-08-27 14:42:15
 * @Description: 媒体相关接口
 * @LastEditors: ShawnPhang <https://m.palxp.cn>
 * @LastEditTime: 2023-12-11 11:40:47
 */
import fetch from '@/utils/axios'

// 获取素材分类：
export const getKinds = (params: Type.Object = {}) => fetch('design/cate', params)

// 获取素材列表：
export const getList = (params: Type.Object = {}) => fetch('design/material', params)

// 获取字体
export const getFonts = (params: Type.Object = {}) => fetch('design/fonts', params)
export const getFontSub = (params: Type.Object = {}, extra: any = {}) => fetch('design/font_sub', params, 'get', {}, extra)

// 图库列表
export const getImagesList = (params: Type.Object = {}) => fetch('design/imgs', params, 'get')

// 我的上传列表
export const getMyPhoto = (params: Type.Object = {}) => fetch('design/user/image', params)
export const deleteMyPhoto = (params: Type.Object = {}) => fetch('design/user/image/del', params, 'post')
export const deleteMyWorks = (params: Type.Object = {}) => fetch('design/poster/del', params, 'post')

// 添加图片
export const addMyPhoto = (params: Type.Object = {}) => fetch('design/user/add_image', params)
