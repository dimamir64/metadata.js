

import EventEmitter from 'events'

/**
 * ### MetaEventEmitter будет прототипом менеджеров данных
 */
export default class MetaEventEmitter extends EventEmitter{

  constructor() {
    super();
    this.setMaxListeners(20);
  }

	/**
	 * Расширяем метод _on_, чтобы в него можно было передать объект
	 * @param type
	 * @param listener
	 */
	on(type, listener){

		if(typeof listener == 'function' && typeof type != 'object'){
			super.on(type, listener);
			return [type, listener];
		}
		else{
			for(let fld in type){
				if(typeof type[fld] == 'function'){
					super.on(fld, type[fld]);
				}
			}
			return this;
		}
	}

  /**
   * Отключатель с поддержкой разных аргументоа для совместимости со старым API
   * @param type
   * @param listener
   */
	off(type, listener){
		if(listener){
			super.removeListener(type, listener);
		}
		else if(Array.isArray(type)){
			super.removeListener(...type);
		}
		else if(typeof type == 'function'){
			throw new TypeError('MetaEventEmitter.off: type must be a string')
		}
		else{
			super.removeAllListeners(type);
		}
	}

  /**
   * Сворачивает массив аргументов
   * @param args
   * @return {Array}
   */
  _distinct(type, handler) {

    const res = [];

    switch (type){
      // для события update, объединяем старые значения реквизитов
      case 'update':
      // для события update, объединяем имена табличных частей
      case 'rows':
        for(const arg of handler.args){
          if(res.some(row => {
              if(row[0] == arg[0]){
                if(!row[1].hasOwnProperty(Object.keys(arg[1])[0])){
                  Object.assign(row[1], arg[1]);
                }
                return true;
              }
            })){
            continue;
          }
          res.push(arg);
        }
        break;

      default:
        // для прочих событий, просто удаляем дубли, группировкой по всем полям
        let len = 0;
        for(const arg of handler.args){
          len = Math.max(len, arg.length);
          if(res.some(row => {
              for(let i = 0; i < len; i++){
                if(arg[i] != row[i]){
                  return true;
                }
              }
            })){
            continue;
          }
          res.push(arg);
        }
    }

    handler.timer = 0;
    handler.args.length = 0;
    return res;
  }

  /**
   * Выполняет отложенный emit, попутно сворачивая аргументы
   * @param type
   */
	_emit(type) {
    for(const args of this._distinct(type, this._async[type])){
      this.emit(type, ...args);
    }
  }

  /**
   * Инициирует отложенный emit
   * @param type
   * @param args
   */
  emit_async(type, ...args) {
    if (!this._events || !this._events[type]){
      return;
    }
    if (!this._async){
      this._async = {};
    }
    if (!this._async[type]){
      this._async[type] = {'args': []};
    }
    const handler = this._async[type];
    handler.timer && clearTimeout(handler.timer);
    handler.args.push(args);
    handler.timer = setTimeout(this._emit.bind(this, type), 4);
  }

}