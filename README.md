# MiddleDrive: Bluetooth通信によるアドホック型ドキュメント共同編集アプリ

![Imgur](https://i.imgur.com/BRsLtMM.png)

## 概要

会議を行う際にその内容を複数人でウェブ上のドキュメントに書き出すことで記録をとったり、議題の整理をしたりすることが多くある。

しかし、Wi-Fiの電波がない場所ではこれらのようなウェブアプリケーションは利用することができない。

そこで、Wi-Fiなどのネットワーク環境が利用できない状況でも、リアルタイムに共同編集を行うことができるアプリケーションを開発した。

ワイヤレスアドホックネットワークを構築し、ネットワーク内のPCとドキュメントの共同編集を行うことが出来る。

## 実装

動作プラットフォームはWindowsPC。

BluetoothによってPC同士をペアリングし、双方向のデータ通信を行う。

各PC内でWebサーバが起動しているため、通常のウェブアプリケーションと同じようにブラウザでアクセスすることが出来る。

Bluetooth通信はC#でwin APIを利用することで実現し、WebサーバはNode.jsを用いて実装している。

## 受賞

2017-12 信州未来アプリコンテスト0 信越情報通信懇談会会長賞

~[http://www.pref.nagano.lg.jp/joho/app-contest/app-contest0](http://www.pref.nagano.lg.jp/joho/app-contest/app-contest0)~ リンク切れしていたので下記画像添付

![受賞写真](http://shisonoha.net/wp-content/uploads/2017/08/20171209_163800-640x360.jpg)
