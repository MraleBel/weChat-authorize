# Authorize

**Authorize 来源**

(1)随着项目的不断迭代，项目的功能也会多种多样，而一些功能的实现，需要依赖微信官方的API，这些API中，有一些是需要用户给予权限后，才能得到相应的回调结果，那么问题就来了，如果用户拒绝了怎么办？好办，那就判断一下，然后写一个弹框窗口的样式，引导用户二次授权，嗯这个页面结束了。第二个界面又需要了。嗯，我可以忍一次，第三个界面……第四个界面……这才只是一个项目。。鬼知道有多少界面需要一些授权前提。

(2)上面的情况，如果只是得到用户的基本信息，那还好，因为如果用户不授权，第二次点击还会提示用户授权。但是不知道为什么微信不能一视同仁的对待一些权限，譬如得到用户地理信息权限（userLocation）当用户第一点击的时候会弹框提示授权，但是第二次点击的时候，如果之前拒绝了，就不会再弹框授权，如果发生这种情况，我们就得按照（1）中的方案来解决了。

基于以上情况，**Authorize**由此而生。

**Authorize 的功能**

- 权限全覆盖，满足微信小程序现有所有权限需求。
- 支持两种触发环境，1.用户点击；2.页面onShow触发。
- 布局自定义，在组件内可直接包裹自定义的布局结构（支持微信分享功能的包裹布局）。
- 专注业务，当授权发起时，对结果提供两种回调，并对拒绝授权提供二次引导授权。


### 运行例子

如果赶时间，可以直接[代码片段](https://developers.weixin.qq.com/s/nswdvBmZ7H7d).   
**注：请选择小程序项目，非小游戏，例子中无 AppId，所以无法在手机上运行，如果需要真机调试，请在打开代码片段时，填上自己的小程序 AppId,其中获取手机号码权限的时候，指定的AppId需要微信认证才能调通!!!!   
最低基础库2.2.3！！！  
最低基础库2.2.3！！！  
最低基础库2.2.3！！！**  



### 使用 Authorize

1. 引入代码

  下载项目到本地，components目录建议放在根目录下

2. 作为自定义组件引入，在需要的页面的.json中

   ```
   "usingComponents":{
     "authorize":"/components/authorize/authorize"
   }
   ```

3. 组件接收 `authorize` 字段作为需要权限的声明,`onAuthorize`作为授权成功的回调注册，主要属性（还有其他可配置属性）代码如下：

   ```
   <authorize authorize="userInfo"  bind:onAuthorize="haveUserAuthorize"></authorize>
   ```
注：<authorize></authorize>标签中可嵌套自定义的布局如：
```
<authorize>
    <view>
      <image class='image-size' mode='aspectFill' src='./wechat-logo.png'></image>
      <text>地理位置</text>
    </view>
</authorize>
```

4. 数据传入后，在触发条件满足时，则会自动判断权限情况。你可以通过绑定 onAuthorize 或 onDeny 事件来获得成功后的数据或授权失败的原因。

   ```
   bind:onAuthorize="haveUserAuthorize"
   bind:onDeny="onDeny"
   
   haveUserAuthorize(e) {
     其中 e.detail. 为返回的数据，详细组件可注册事件小节
   },
    onDeny(e) {
     其中 e.detail.errMsg 为授权失败的原因
   },
   ```



### 组件可设置属性

当有自定义信息展示的时候可设置相应属性的值，满足不同场景的需求

| 属性名   |type   |         默认值                  |  描述                        |            可选项                     |
| ------ | ------- | ------------------------------ | ------------------|--------------------------------|
| authorize|String|""|声明业务所需要的权限文本|userInfo，userLocation  address，invoiceTitle  invoice，werun，record writePhotosAlbum，camera  phoneNumber，share(没有回调事件)|
| authorizeDesc | String | 一键授权     |用于提示用户所要获取的权限文本  | 根据authorize设置的值匹配      |
| denyShowDesc| String | 授权失败,请重新授权    | 用户拒绝授权后的文本描述| 可自定义   |
| dataId | String |""    |用于接受使用页面传过来的id，在授权成功回调中会将传入的此值返回去如在商品列表中点击某一项时传入商品id在授权后可从成功回调将此id传入下一个商品详情页面| 可自定义|
| dataIndex | Number |-1    |用途同dataId只是接受类型为number| 可自定义|
| dataObj | Object | null    |用途同dataId只是接受类型为Object|可自定义 |
| noOpenAuthorizeDesc | String | 权限未开启,请重新打开    |引导用户二次授权跳转到微信权限设置页面返回后，如果用户未打开的文本描述|可自定义 |
| isOnShowPopUp | Boolean | false  |是否在组件所在页面的onShow生命周期申请指定权限|true/false |
| isClickMaskClose | Boolean | true  |是否点击弹框后面的蒙层时，关闭弹框|true/false |
| noOpenAuthorizeDesc |String | 权限未开启,请重新打开  |引导用户二次授权跳转到微信权限设置页面返回后，如果用户未打开的文本描述| 可自定义|


#### 组件可注册事件

区分权限授予情况，进行不同业务逻辑。

| 事件   | 描述     |   
| ------ | ------- |
| onAuthorize | 当用户授权成功后回调的事件，当authorize为userInfo和phoneNumber时  回调的函数参数中会返回相应数据  除此之外的其他权限不一定会返回，因为其他权限可能是二次引导后，用户跳转到权限设置界面后授予的权限。 建议在授权回调中去主动调用相应api拿取数据 |
| onDeny | 当用户拒绝授权后，或者二次引导未打开相应权限后回调的事件  回调参数中会返回授权失败的原因 |
| onClickMask | 当设置isClickMaskClose为false时，回调的事件，可用来显示文字提示用户授权 |


#### 全局（app）可设置属性

可在全局配置文件app.json中设置弹框授权的全局样式，包括展示logo、服务提供方、点击按钮背景色（根据项目主题设置）

| 属性名   |type   |         默认值                  |  描述                        |            可选项                     |
| ------ | ------- | ------------------------------ | ------------------|--------------------------------|
| authorizeLogo | String |  微信logo    |引导弹框授权时显示的图片  | 可自定义  需要在app.json的globalData中设置authorizeLogo值为图片的绝对路径      |
| authorizeTitle | String |  开发者|授权后{{title}}将为您提供更优质的服务，替换这段文本中的title字段   | 可自定义  需要在app.json的globalData中设置authorizeTitle     |
| authorizeTextBgColor | String |   authorizeDesc    |引导弹框授权时点击button的背景色  | 可自定义  需要在app.json的globalData中设置authorizeTextBgColor     |


#### 应用场景

- 可在首页或者需要userInfo权限的页面设置isOnShowPopUp=true，这样，只要页面调用onShow时就会申请权限，待用户授予权限再从回调中绑定用户信息，之后可进行相关业务逻辑。
- 当B界面有需要用到userLocation权限时，可在A界面跳转前去点击组件嵌套的布局去获取位置权限，在回调中再跳转到b界面，这样在b界面就不用担心用户是否授权（但凡有用到map组件的前一个页面均可考虑此方案）。
- 当有使用canvas画图保存到本地的按钮时，建议嵌套此组件，在相关按钮上，即可不用顾虑权限授予情况。

### Tips（一定要看哦～）

1，不建议在设置isOnShowPopUp=true的情况下去获取用户手机权限，因为此权限特点是'即用即要'，不会保存用户的授予状态，即第一次同意授予后，第二次需要的时候，还是需要重新询问顾客，如果放在onshow的回调中去获取，会每次重新看到界面就会弹框索要一次，不友好，不建议。

2，当设置isClickMaskClose=false时，此时的状态为，界面只有授权后才能进行其他操作，即不授权，无法关闭弹窗。

## Thanks
感谢自己以及看到的人们。

## 写在最后
本人手拙，可能写的不是很好，还请大神们多多指点。  自己还封装了一些其他的组件，平时都是自己在项目中用，觉得还不错，所以拿出来和大家分享，如果大家喜欢，后续我还会更新一些其他的组件，敬请期待吧……:)

