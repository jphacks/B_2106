# <img style="width:50px" src="./frontend/public/logo192.png"> どこでも麻雀卓
<div align="center"><a href="https://www.youtube.com/watch?v=CbltadOrfak&feature=youtu.be">
<img src="https://user-images.githubusercontent.com/15964431/142654081-7ff76835-cbd5-469a-a6a6-feb3bac822ed.png" alt="デモ動画" title="タイトル"></a>
</div>

## どこでも麻雀卓URL
実際に下記URLでゲームを遊ぶことが可能です。  

http://mahjongtaku.com


## 製品概要

### 背景(製品開発のきっかけ、課題等）

コロナ期間中に「雀魂」等のオンライン対戦が可能であるスマホアプリが大流行しました。
最近はコロナが沈静化し、それに伴って対面で友達とスマホアプリを使って対戦するケースが増加しました。

私達はこのような対面でのスマホアプリを用いた麻雀で一体感が大きく損なわれているという部分に課題があると考えました。

スマホアプリはオンラインプレイが想定されているため、自分の画面で機能が完結し、プレイヤーは自分のスマホ画面だけを眺めています。

例えばボードゲームやポーカーのように一つの盤面をシェアすることこそがオフラインの醍醐味でありこれによって場に一体感、臨場感が生まれ、それらがプレイヤーの満足感につながっていると私達は考えています。

![image](https://user-images.githubusercontent.com/53958213/142645004-b40743a6-8f51-47b0-9f87-709fbeacc2ce.jpg)


### 製品説明
公開情報である河などの盤面をタブレット上で、プレイヤー個人の情報である手牌をスマホ上に表示することで、アプリの手軽さとオフラインの一体感のいいとこ取りを可能とします。麻雀の複雑なルールをそのまま実装できなかったため，簡素化したルールを実装している． 

セットアップの仕方は[docs](https://github.com/jphacks/B_2106/blob/main/docs/setup.md)を参照


#### タブレットの画面
<img width="1315" alt="タブレットの画面" src="https://user-images.githubusercontent.com/53958213/142666628-4e687625-af07-4bca-a259-cfdcd2370ff6.png">

#### スマホの画面
<img width="1308" alt="スマホの画面" src="https://user-images.githubusercontent.com/53958213/142666640-d615dc5f-068f-44e5-9ccb-ac99bdf5356a.png">


### 特長

#### 1. 手牌画面と盤面画面を分岐しているので、実際の麻雀卓を囲んでいる感覚を味わえる。
#### 2. アナログの麻雀を持ち運ぶのは大変だが，タブレットとスマホは容易に持ち運べる
#### 3. Webアプリなのでインストールの必要がない


### 今後の展望
- 実装できていない麻雀のルール
  - 鳴き(チー、ポン、カン)の実装
  - 連荘の実装
  - 赤ドラの実装
  - etc
- エフェクトの実装
- アシスト機能の実装


## 開発技術

### 活用した技術
<img  alt="tech" src="https://user-images.githubusercontent.com/53958213/142648267-e6ce2c95-0413-4484-b80e-707e67fb538c.png">

#### 技術の詳細

- フロントエンドアプリケーション
    - React
    - React Hooks
    - Redux Toolkit
    - SCSS
    - Material UI
    - React Hook Form
    - Socket.io
    - TypeScript

- バックエンドアプリケーション
    - Socket.io
    - node.js
    - express
    - [syanten](https://www.npmjs.com/package/syanten?activeTab=readme)

- インフラ
    - Docker/Docker-compose
    - AWS
    - terraform
    - Github Actions

#### 注力したこと（こだわり等）

- よりユーザが気軽に遊べるようにWebベースでの実現にこだわった。
- 麻雀卓のようにタブレットの4方向から使いやすいUIを実装した。
- メンバーの勉強も兼ねてReact HooksやTypeScirptといったモダンな技術を使用している。
- Dockerでバックエンド、フロントエンドを簡単に構築できるようにした。
- mainにマージするだけで、本番環境に自動でデプロイされる。
- Terraformも用いることで、インフラをコード化した。


#### デバイス
- タブレット（盤面表示用）
- スマートフォン4つ（手牌表示用）

### 独自技術
- 麻雀の複雑なルールの一部をReactベースで実装した
- 麻雀の複雑なゲーム画面をReactで実装した
- [タブレット側のゲーム画面](https://github.com/jphacks/B_2106/tree/main/frontend/src/pages/GameHost)を実装することが特に大変だった
