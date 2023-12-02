var bm = Object.defineProperty,
  Em = Object.defineProperties;
var Im = Object.getOwnPropertyDescriptors;
var $u = Object.getOwnPropertySymbols;
var Mm = Object.prototype.hasOwnProperty,
  Sm = Object.prototype.propertyIsEnumerable;
var Uu = (t, e, r) => (e in t ? bm(t, e, { enumerable: !0, configurable: !0, writable: !0, value: r }) : (t[e] = r)),
  m = (t, e) => {
    for (var r in (e ||= {})) Mm.call(e, r) && Uu(t, r, e[r]);
    if ($u) for (var r of $u(e)) Sm.call(e, r) && Uu(t, r, e[r]);
    return t;
  },
  G = (t, e) => Em(t, Im(e));
var Hu = null;
var Qs = 1;
function he(t) {
  let e = Hu;
  return (Hu = t), e;
}
var zu = {
  version: 0,
  lastCleanEpoch: 0,
  dirty: !1,
  producerNode: void 0,
  producerLastReadVersion: void 0,
  producerIndexOfThis: void 0,
  nextProducerIndex: 0,
  liveConsumerNode: void 0,
  liveConsumerIndexOfThis: void 0,
  consumerAllowSignalWrites: !1,
  consumerIsAlwaysLive: !1,
  producerMustRecompute: () => !1,
  producerRecomputeValue: () => {},
  consumerMarkedDirty: () => {},
  consumerOnSignalRead: () => {},
};
function xm(t) {
  if (!(ea(t) && !t.dirty) && !(!t.dirty && t.lastCleanEpoch === Qs)) {
    if (!t.producerMustRecompute(t) && !Xs(t)) {
      (t.dirty = !1), (t.lastCleanEpoch = Qs);
      return;
    }
    t.producerRecomputeValue(t), (t.dirty = !1), (t.lastCleanEpoch = Qs);
  }
}
function Wu(t) {
  return t && (t.nextProducerIndex = 0), he(t);
}
function Gu(t, e) {
  if ((he(e), !(!t || t.producerNode === void 0 || t.producerIndexOfThis === void 0 || t.producerLastReadVersion === void 0))) {
    if (ea(t)) for (let r = t.nextProducerIndex; r < t.producerNode.length; r++) Js(t.producerNode[r], t.producerIndexOfThis[r]);
    for (; t.producerNode.length > t.nextProducerIndex; )
      t.producerNode.pop(), t.producerLastReadVersion.pop(), t.producerIndexOfThis.pop();
  }
}
function Xs(t) {
  Fi(t);
  for (let e = 0; e < t.producerNode.length; e++) {
    let r = t.producerNode[e],
      n = t.producerLastReadVersion[e];
    if (n !== r.version || (xm(r), n !== r.version)) return !0;
  }
  return !1;
}
function qu(t) {
  if ((Fi(t), ea(t))) for (let e = 0; e < t.producerNode.length; e++) Js(t.producerNode[e], t.producerIndexOfThis[e]);
  (t.producerNode.length = t.producerLastReadVersion.length = t.producerIndexOfThis.length = 0),
    t.liveConsumerNode && (t.liveConsumerNode.length = t.liveConsumerIndexOfThis.length = 0);
}
function Js(t, e) {
  if ((Am(t), Fi(t), t.liveConsumerNode.length === 1))
    for (let n = 0; n < t.producerNode.length; n++) Js(t.producerNode[n], t.producerIndexOfThis[n]);
  let r = t.liveConsumerNode.length - 1;
  if (
    ((t.liveConsumerNode[e] = t.liveConsumerNode[r]),
    (t.liveConsumerIndexOfThis[e] = t.liveConsumerIndexOfThis[r]),
    t.liveConsumerNode.length--,
    t.liveConsumerIndexOfThis.length--,
    e < t.liveConsumerNode.length)
  ) {
    let n = t.liveConsumerIndexOfThis[e],
      i = t.liveConsumerNode[e];
    Fi(i), (i.producerIndexOfThis[n] = e);
  }
}
function ea(t) {
  return t.consumerIsAlwaysLive || (t?.liveConsumerNode?.length ?? 0) > 0;
}
function Fi(t) {
  (t.producerNode ??= []), (t.producerIndexOfThis ??= []), (t.producerLastReadVersion ??= []);
}
function Am(t) {
  (t.liveConsumerNode ??= []), (t.liveConsumerIndexOfThis ??= []);
}
function Tm() {
  throw new Error();
}
var Om = Tm;
function Yu(t) {
  Om = t;
}
function E(t) {
  return typeof t == 'function';
}
function wn(t) {
  let r = t((n) => {
    Error.call(n), (n.stack = new Error().stack);
  });
  return (r.prototype = Object.create(Error.prototype)), (r.prototype.constructor = r), r;
}
var ki = wn(
  (t) =>
    function (r) {
      t(this),
        (this.message = r
          ? `${r.length} errors occurred during unsubscription:
${r.map((n, i) => `${i + 1}) ${n.toString()}`).join(`
  `)}`
          : ''),
        (this.name = 'UnsubscriptionError'),
        (this.errors = r);
    },
);
function Ht(t, e) {
  if (t) {
    let r = t.indexOf(e);
    0 <= r && t.splice(r, 1);
  }
}
var q = class t {
  constructor(e) {
    (this.initialTeardown = e), (this.closed = !1), (this._parentage = null), (this._finalizers = null);
  }
  unsubscribe() {
    let e;
    if (!this.closed) {
      this.closed = !0;
      let { _parentage: r } = this;
      if (r)
        if (((this._parentage = null), Array.isArray(r))) for (let o of r) o.remove(this);
        else r.remove(this);
      let { initialTeardown: n } = this;
      if (E(n))
        try {
          n();
        } catch (o) {
          e = o instanceof ki ? o.errors : [o];
        }
      let { _finalizers: i } = this;
      if (i) {
        this._finalizers = null;
        for (let o of i)
          try {
            Zu(o);
          } catch (s) {
            (e = e ?? []), s instanceof ki ? (e = [...e, ...s.errors]) : e.push(s);
          }
      }
      if (e) throw new ki(e);
    }
  }
  add(e) {
    var r;
    if (e && e !== this)
      if (this.closed) Zu(e);
      else {
        if (e instanceof t) {
          if (e.closed || e._hasParent(this)) return;
          e._addParent(this);
        }
        (this._finalizers = (r = this._finalizers) !== null && r !== void 0 ? r : []).push(e);
      }
  }
  _hasParent(e) {
    let { _parentage: r } = this;
    return r === e || (Array.isArray(r) && r.includes(e));
  }
  _addParent(e) {
    let { _parentage: r } = this;
    this._parentage = Array.isArray(r) ? (r.push(e), r) : r ? [r, e] : e;
  }
  _removeParent(e) {
    let { _parentage: r } = this;
    r === e ? (this._parentage = null) : Array.isArray(r) && Ht(r, e);
  }
  remove(e) {
    let { _finalizers: r } = this;
    r && Ht(r, e), e instanceof t && e._removeParent(this);
  }
};
q.EMPTY = (() => {
  let t = new q();
  return (t.closed = !0), t;
})();
var ta = q.EMPTY;
function Li(t) {
  return t instanceof q || (t && 'closed' in t && E(t.remove) && E(t.add) && E(t.unsubscribe));
}
function Zu(t) {
  E(t) ? t() : t.unsubscribe();
}
var We = {
  onUnhandledError: null,
  onStoppedNotification: null,
  Promise: void 0,
  useDeprecatedSynchronousErrorHandling: !1,
  useDeprecatedNextContext: !1,
};
var bn = {
  setTimeout(t, e, ...r) {
    let { delegate: n } = bn;
    return n?.setTimeout ? n.setTimeout(t, e, ...r) : setTimeout(t, e, ...r);
  },
  clearTimeout(t) {
    let { delegate: e } = bn;
    return (e?.clearTimeout || clearTimeout)(t);
  },
  delegate: void 0,
};
function Vi(t) {
  bn.setTimeout(() => {
    let { onUnhandledError: e } = We;
    if (e) e(t);
    else throw t;
  });
}
function Mr() {}
var Ku = (() => na('C', void 0, void 0))();
function Qu(t) {
  return na('E', void 0, t);
}
function Xu(t) {
  return na('N', t, void 0);
}
function na(t, e, r) {
  return { kind: t, value: e, error: r };
}
var zt = null;
function En(t) {
  if (We.useDeprecatedSynchronousErrorHandling) {
    let e = !zt;
    if ((e && (zt = { errorThrown: !1, error: null }), t(), e)) {
      let { errorThrown: r, error: n } = zt;
      if (((zt = null), r)) throw n;
    }
  } else t();
}
function Ju(t) {
  We.useDeprecatedSynchronousErrorHandling && zt && ((zt.errorThrown = !0), (zt.error = t));
}
var Wt = class extends q {
    constructor(e) {
      super(), (this.isStopped = !1), e ? ((this.destination = e), Li(e) && e.add(this)) : (this.destination = Pm);
    }
    static create(e, r, n) {
      return new pt(e, r, n);
    }
    next(e) {
      this.isStopped ? ia(Xu(e), this) : this._next(e);
    }
    error(e) {
      this.isStopped ? ia(Qu(e), this) : ((this.isStopped = !0), this._error(e));
    }
    complete() {
      this.isStopped ? ia(Ku, this) : ((this.isStopped = !0), this._complete());
    }
    unsubscribe() {
      this.closed || ((this.isStopped = !0), super.unsubscribe(), (this.destination = null));
    }
    _next(e) {
      this.destination.next(e);
    }
    _error(e) {
      try {
        this.destination.error(e);
      } finally {
        this.unsubscribe();
      }
    }
    _complete() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    }
  },
  Rm = Function.prototype.bind;
function ra(t, e) {
  return Rm.call(t, e);
}
var oa = class {
    constructor(e) {
      this.partialObserver = e;
    }
    next(e) {
      let { partialObserver: r } = this;
      if (r.next)
        try {
          r.next(e);
        } catch (n) {
          ji(n);
        }
    }
    error(e) {
      let { partialObserver: r } = this;
      if (r.error)
        try {
          r.error(e);
        } catch (n) {
          ji(n);
        }
      else ji(e);
    }
    complete() {
      let { partialObserver: e } = this;
      if (e.complete)
        try {
          e.complete();
        } catch (r) {
          ji(r);
        }
    }
  },
  pt = class extends Wt {
    constructor(e, r, n) {
      super();
      let i;
      if (E(e) || !e) i = { next: e ?? void 0, error: r ?? void 0, complete: n ?? void 0 };
      else {
        let o;
        this && We.useDeprecatedNextContext
          ? ((o = Object.create(e)),
            (o.unsubscribe = () => this.unsubscribe()),
            (i = { next: e.next && ra(e.next, o), error: e.error && ra(e.error, o), complete: e.complete && ra(e.complete, o) }))
          : (i = e);
      }
      this.destination = new oa(i);
    }
  };
function ji(t) {
  We.useDeprecatedSynchronousErrorHandling ? Ju(t) : Vi(t);
}
function Nm(t) {
  throw t;
}
function ia(t, e) {
  let { onStoppedNotification: r } = We;
  r && bn.setTimeout(() => r(t, e));
}
var Pm = { closed: !0, next: Mr, error: Nm, complete: Mr };
var In = (() => (typeof Symbol == 'function' && Symbol.observable) || '@@observable')();
function _e(t) {
  return t;
}
function sa(...t) {
  return aa(t);
}
function aa(t) {
  return t.length === 0
    ? _e
    : t.length === 1
      ? t[0]
      : function (r) {
          return t.reduce((n, i) => i(n), r);
        };
}
var R = (() => {
  class t {
    constructor(r) {
      r && (this._subscribe = r);
    }
    lift(r) {
      let n = new t();
      return (n.source = this), (n.operator = r), n;
    }
    subscribe(r, n, i) {
      let o = km(r) ? r : new pt(r, n, i);
      return (
        En(() => {
          let { operator: s, source: a } = this;
          o.add(s ? s.call(o, a) : a ? this._subscribe(o) : this._trySubscribe(o));
        }),
        o
      );
    }
    _trySubscribe(r) {
      try {
        return this._subscribe(r);
      } catch (n) {
        r.error(n);
      }
    }
    forEach(r, n) {
      return (
        (n = ed(n)),
        new n((i, o) => {
          let s = new pt({
            next: (a) => {
              try {
                r(a);
              } catch (c) {
                o(c), s.unsubscribe();
              }
            },
            error: o,
            complete: i,
          });
          this.subscribe(s);
        })
      );
    }
    _subscribe(r) {
      var n;
      return (n = this.source) === null || n === void 0 ? void 0 : n.subscribe(r);
    }
    [In]() {
      return this;
    }
    pipe(...r) {
      return aa(r)(this);
    }
    toPromise(r) {
      return (
        (r = ed(r)),
        new r((n, i) => {
          let o;
          this.subscribe(
            (s) => (o = s),
            (s) => i(s),
            () => n(o),
          );
        })
      );
    }
  }
  return (t.create = (e) => new t(e)), t;
})();
function ed(t) {
  var e;
  return (e = t ?? We.Promise) !== null && e !== void 0 ? e : Promise;
}
function Fm(t) {
  return t && E(t.next) && E(t.error) && E(t.complete);
}
function km(t) {
  return (t && t instanceof Wt) || (Fm(t) && Li(t));
}
function ca(t) {
  return E(t?.lift);
}
function N(t) {
  return (e) => {
    if (ca(e))
      return e.lift(function (r) {
        try {
          return t(r, this);
        } catch (n) {
          this.error(n);
        }
      });
    throw new TypeError('Unable to lift unknown Observable type');
  };
}
function T(t, e, r, n, i) {
  return new la(t, e, r, n, i);
}
var la = class extends Wt {
  constructor(e, r, n, i, o, s) {
    super(e),
      (this.onFinalize = o),
      (this.shouldUnsubscribe = s),
      (this._next = r
        ? function (a) {
            try {
              r(a);
            } catch (c) {
              e.error(c);
            }
          }
        : super._next),
      (this._error = i
        ? function (a) {
            try {
              i(a);
            } catch (c) {
              e.error(c);
            } finally {
              this.unsubscribe();
            }
          }
        : super._error),
      (this._complete = n
        ? function () {
            try {
              n();
            } catch (a) {
              e.error(a);
            } finally {
              this.unsubscribe();
            }
          }
        : super._complete);
  }
  unsubscribe() {
    var e;
    if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
      let { closed: r } = this;
      super.unsubscribe(), !r && ((e = this.onFinalize) === null || e === void 0 || e.call(this));
    }
  }
};
function Mn() {
  return N((t, e) => {
    let r = null;
    t._refCount++;
    let n = T(e, void 0, void 0, void 0, () => {
      if (!t || t._refCount <= 0 || 0 < --t._refCount) {
        r = null;
        return;
      }
      let i = t._connection,
        o = r;
      (r = null), i && (!o || i === o) && i.unsubscribe(), e.unsubscribe();
    });
    t.subscribe(n), n.closed || (r = t.connect());
  });
}
var Sn = class extends R {
  constructor(e, r) {
    super(),
      (this.source = e),
      (this.subjectFactory = r),
      (this._subject = null),
      (this._refCount = 0),
      (this._connection = null),
      ca(e) && (this.lift = e.lift);
  }
  _subscribe(e) {
    return this.getSubject().subscribe(e);
  }
  getSubject() {
    let e = this._subject;
    return (!e || e.isStopped) && (this._subject = this.subjectFactory()), this._subject;
  }
  _teardown() {
    this._refCount = 0;
    let { _connection: e } = this;
    (this._subject = this._connection = null), e?.unsubscribe();
  }
  connect() {
    let e = this._connection;
    if (!e) {
      e = this._connection = new q();
      let r = this.getSubject();
      e.add(
        this.source.subscribe(
          T(
            r,
            void 0,
            () => {
              this._teardown(), r.complete();
            },
            (n) => {
              this._teardown(), r.error(n);
            },
            () => this._teardown(),
          ),
        ),
      ),
        e.closed && ((this._connection = null), (e = q.EMPTY));
    }
    return e;
  }
  refCount() {
    return Mn()(this);
  }
};
var td = wn(
  (t) =>
    function () {
      t(this), (this.name = 'ObjectUnsubscribedError'), (this.message = 'object unsubscribed');
    },
);
var $ = (() => {
    class t extends R {
      constructor() {
        super(),
          (this.closed = !1),
          (this.currentObservers = null),
          (this.observers = []),
          (this.isStopped = !1),
          (this.hasError = !1),
          (this.thrownError = null);
      }
      lift(r) {
        let n = new Bi(this, this);
        return (n.operator = r), n;
      }
      _throwIfClosed() {
        if (this.closed) throw new td();
      }
      next(r) {
        En(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.currentObservers || (this.currentObservers = Array.from(this.observers));
            for (let n of this.currentObservers) n.next(r);
          }
        });
      }
      error(r) {
        En(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            (this.hasError = this.isStopped = !0), (this.thrownError = r);
            let { observers: n } = this;
            for (; n.length; ) n.shift().error(r);
          }
        });
      }
      complete() {
        En(() => {
          if ((this._throwIfClosed(), !this.isStopped)) {
            this.isStopped = !0;
            let { observers: r } = this;
            for (; r.length; ) r.shift().complete();
          }
        });
      }
      unsubscribe() {
        (this.isStopped = this.closed = !0), (this.observers = this.currentObservers = null);
      }
      get observed() {
        var r;
        return ((r = this.observers) === null || r === void 0 ? void 0 : r.length) > 0;
      }
      _trySubscribe(r) {
        return this._throwIfClosed(), super._trySubscribe(r);
      }
      _subscribe(r) {
        return this._throwIfClosed(), this._checkFinalizedStatuses(r), this._innerSubscribe(r);
      }
      _innerSubscribe(r) {
        let { hasError: n, isStopped: i, observers: o } = this;
        return n || i
          ? ta
          : ((this.currentObservers = null),
            o.push(r),
            new q(() => {
              (this.currentObservers = null), Ht(o, r);
            }));
      }
      _checkFinalizedStatuses(r) {
        let { hasError: n, thrownError: i, isStopped: o } = this;
        n ? r.error(i) : o && r.complete();
      }
      asObservable() {
        let r = new R();
        return (r.source = this), r;
      }
    }
    return (t.create = (e, r) => new Bi(e, r)), t;
  })(),
  Bi = class extends $ {
    constructor(e, r) {
      super(), (this.destination = e), (this.source = r);
    }
    next(e) {
      var r, n;
      (n = (r = this.destination) === null || r === void 0 ? void 0 : r.next) === null || n === void 0 || n.call(r, e);
    }
    error(e) {
      var r, n;
      (n = (r = this.destination) === null || r === void 0 ? void 0 : r.error) === null || n === void 0 || n.call(r, e);
    }
    complete() {
      var e, r;
      (r = (e = this.destination) === null || e === void 0 ? void 0 : e.complete) === null || r === void 0 || r.call(e);
    }
    _subscribe(e) {
      var r, n;
      return (n = (r = this.source) === null || r === void 0 ? void 0 : r.subscribe(e)) !== null && n !== void 0 ? n : ta;
    }
  };
var le = class extends $ {
  constructor(e) {
    super(), (this._value = e);
  }
  get value() {
    return this.getValue();
  }
  _subscribe(e) {
    let r = super._subscribe(e);
    return !r.closed && e.next(this._value), r;
  }
  getValue() {
    let { hasError: e, thrownError: r, _value: n } = this;
    if (e) throw r;
    return this._throwIfClosed(), n;
  }
  next(e) {
    super.next((this._value = e));
  }
};
var ua = {
  now() {
    return (ua.delegate || Date).now();
  },
  delegate: void 0,
};
var $i = class extends q {
  constructor(e, r) {
    super();
  }
  schedule(e, r = 0) {
    return this;
  }
};
var Sr = {
  setInterval(t, e, ...r) {
    let { delegate: n } = Sr;
    return n?.setInterval ? n.setInterval(t, e, ...r) : setInterval(t, e, ...r);
  },
  clearInterval(t) {
    let { delegate: e } = Sr;
    return (e?.clearInterval || clearInterval)(t);
  },
  delegate: void 0,
};
var Ui = class extends $i {
  constructor(e, r) {
    super(e, r), (this.scheduler = e), (this.work = r), (this.pending = !1);
  }
  schedule(e, r = 0) {
    var n;
    if (this.closed) return this;
    this.state = e;
    let i = this.id,
      o = this.scheduler;
    return (
      i != null && (this.id = this.recycleAsyncId(o, i, r)),
      (this.pending = !0),
      (this.delay = r),
      (this.id = (n = this.id) !== null && n !== void 0 ? n : this.requestAsyncId(o, this.id, r)),
      this
    );
  }
  requestAsyncId(e, r, n = 0) {
    return Sr.setInterval(e.flush.bind(e, this), n);
  }
  recycleAsyncId(e, r, n = 0) {
    if (n != null && this.delay === n && this.pending === !1) return r;
    r != null && Sr.clearInterval(r);
  }
  execute(e, r) {
    if (this.closed) return new Error('executing a cancelled action');
    this.pending = !1;
    let n = this._execute(e, r);
    if (n) return n;
    this.pending === !1 && this.id != null && (this.id = this.recycleAsyncId(this.scheduler, this.id, null));
  }
  _execute(e, r) {
    let n = !1,
      i;
    try {
      this.work(e);
    } catch (o) {
      (n = !0), (i = o || new Error('Scheduled action threw falsy error'));
    }
    if (n) return this.unsubscribe(), i;
  }
  unsubscribe() {
    if (!this.closed) {
      let { id: e, scheduler: r } = this,
        { actions: n } = r;
      (this.work = this.state = this.scheduler = null),
        (this.pending = !1),
        Ht(n, this),
        e != null && (this.id = this.recycleAsyncId(r, e, null)),
        (this.delay = null),
        super.unsubscribe();
    }
  }
};
var xn = class t {
  constructor(e, r = t.now) {
    (this.schedulerActionCtor = e), (this.now = r);
  }
  schedule(e, r = 0, n) {
    return new this.schedulerActionCtor(this, e).schedule(n, r);
  }
};
xn.now = ua.now;
var Hi = class extends xn {
  constructor(e, r = xn.now) {
    super(e, r), (this.actions = []), (this._active = !1);
  }
  flush(e) {
    let { actions: r } = this;
    if (this._active) {
      r.push(e);
      return;
    }
    let n;
    this._active = !0;
    do if ((n = e.execute(e.state, e.delay))) break;
    while ((e = r.shift()));
    if (((this._active = !1), n)) {
      for (; (e = r.shift()); ) e.unsubscribe();
      throw n;
    }
  }
};
var da = new Hi(Ui),
  nd = da;
var Me = new R((t) => t.complete());
function zi(t) {
  return t && E(t.schedule);
}
function fa(t) {
  return t[t.length - 1];
}
function Wi(t) {
  return E(fa(t)) ? t.pop() : void 0;
}
function et(t) {
  return zi(fa(t)) ? t.pop() : void 0;
}
function rd(t, e) {
  return typeof fa(t) == 'number' ? t.pop() : e;
}
function od(t, e, r, n) {
  function i(o) {
    return o instanceof r
      ? o
      : new r(function (s) {
          s(o);
        });
  }
  return new (r || (r = Promise))(function (o, s) {
    function a(u) {
      try {
        l(n.next(u));
      } catch (d) {
        s(d);
      }
    }
    function c(u) {
      try {
        l(n.throw(u));
      } catch (d) {
        s(d);
      }
    }
    function l(u) {
      u.done ? o(u.value) : i(u.value).then(a, c);
    }
    l((n = n.apply(t, e || [])).next());
  });
}
function id(t) {
  var e = typeof Symbol == 'function' && Symbol.iterator,
    r = e && t[e],
    n = 0;
  if (r) return r.call(t);
  if (t && typeof t.length == 'number')
    return {
      next: function () {
        return t && n >= t.length && (t = void 0), { value: t && t[n++], done: !t };
      },
    };
  throw new TypeError(e ? 'Object is not iterable.' : 'Symbol.iterator is not defined.');
}
function Gt(t) {
  return this instanceof Gt ? ((this.v = t), this) : new Gt(t);
}
function sd(t, e, r) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var n = r.apply(t, e || []),
    i,
    o = [];
  return (
    (i = {}),
    s('next'),
    s('throw'),
    s('return'),
    (i[Symbol.asyncIterator] = function () {
      return this;
    }),
    i
  );
  function s(f) {
    n[f] &&
      (i[f] = function (h) {
        return new Promise(function (g, w) {
          o.push([f, h, g, w]) > 1 || a(f, h);
        });
      });
  }
  function a(f, h) {
    try {
      c(n[f](h));
    } catch (g) {
      d(o[0][3], g);
    }
  }
  function c(f) {
    f.value instanceof Gt ? Promise.resolve(f.value.v).then(l, u) : d(o[0][2], f);
  }
  function l(f) {
    a('next', f);
  }
  function u(f) {
    a('throw', f);
  }
  function d(f, h) {
    f(h), o.shift(), o.length && a(o[0][0], o[0][1]);
  }
}
function ad(t) {
  if (!Symbol.asyncIterator) throw new TypeError('Symbol.asyncIterator is not defined.');
  var e = t[Symbol.asyncIterator],
    r;
  return e
    ? e.call(t)
    : ((t = typeof id == 'function' ? id(t) : t[Symbol.iterator]()),
      (r = {}),
      n('next'),
      n('throw'),
      n('return'),
      (r[Symbol.asyncIterator] = function () {
        return this;
      }),
      r);
  function n(o) {
    r[o] =
      t[o] &&
      function (s) {
        return new Promise(function (a, c) {
          (s = t[o](s)), i(a, c, s.done, s.value);
        });
      };
  }
  function i(o, s, a, c) {
    Promise.resolve(c).then(function (l) {
      o({ value: l, done: a });
    }, s);
  }
}
var An = (t) => t && typeof t.length == 'number' && typeof t != 'function';
function Gi(t) {
  return E(t?.then);
}
function qi(t) {
  return E(t[In]);
}
function Yi(t) {
  return Symbol.asyncIterator && E(t?.[Symbol.asyncIterator]);
}
function Zi(t) {
  return new TypeError(
    `You provided ${
      t !== null && typeof t == 'object' ? 'an invalid object' : `'${t}'`
    } where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.`,
  );
}
function Lm() {
  return typeof Symbol != 'function' || !Symbol.iterator ? '@@iterator' : Symbol.iterator;
}
var Ki = Lm();
function Qi(t) {
  return E(t?.[Ki]);
}
function Xi(t) {
  return sd(this, arguments, function* () {
    let r = t.getReader();
    try {
      for (;;) {
        let { value: n, done: i } = yield Gt(r.read());
        if (i) return yield Gt(void 0);
        yield yield Gt(n);
      }
    } finally {
      r.releaseLock();
    }
  });
}
function Ji(t) {
  return E(t?.getReader);
}
function Y(t) {
  if (t instanceof R) return t;
  if (t != null) {
    if (qi(t)) return Vm(t);
    if (An(t)) return jm(t);
    if (Gi(t)) return Bm(t);
    if (Yi(t)) return cd(t);
    if (Qi(t)) return $m(t);
    if (Ji(t)) return Um(t);
  }
  throw Zi(t);
}
function Vm(t) {
  return new R((e) => {
    let r = t[In]();
    if (E(r.subscribe)) return r.subscribe(e);
    throw new TypeError('Provided object does not correctly implement Symbol.observable');
  });
}
function jm(t) {
  return new R((e) => {
    for (let r = 0; r < t.length && !e.closed; r++) e.next(t[r]);
    e.complete();
  });
}
function Bm(t) {
  return new R((e) => {
    t.then(
      (r) => {
        e.closed || (e.next(r), e.complete());
      },
      (r) => e.error(r),
    ).then(null, Vi);
  });
}
function $m(t) {
  return new R((e) => {
    for (let r of t) if ((e.next(r), e.closed)) return;
    e.complete();
  });
}
function cd(t) {
  return new R((e) => {
    Hm(t, e).catch((r) => e.error(r));
  });
}
function Um(t) {
  return cd(Xi(t));
}
function Hm(t, e) {
  var r, n, i, o;
  return od(this, void 0, void 0, function* () {
    try {
      for (r = ad(t); (n = yield r.next()), !n.done; ) {
        let s = n.value;
        if ((e.next(s), e.closed)) return;
      }
    } catch (s) {
      i = { error: s };
    } finally {
      try {
        n && !n.done && (o = r.return) && (yield o.call(r));
      } finally {
        if (i) throw i.error;
      }
    }
    e.complete();
  });
}
function Se(t, e, r, n = 0, i = !1) {
  let o = e.schedule(function () {
    r(), i ? t.add(this.schedule(null, n)) : this.unsubscribe();
  }, n);
  if ((t.add(o), !i)) return o;
}
function eo(t, e = 0) {
  return N((r, n) => {
    r.subscribe(
      T(
        n,
        (i) => Se(n, t, () => n.next(i), e),
        () => Se(n, t, () => n.complete(), e),
        (i) => Se(n, t, () => n.error(i), e),
      ),
    );
  });
}
function to(t, e = 0) {
  return N((r, n) => {
    n.add(t.schedule(() => r.subscribe(n), e));
  });
}
function ld(t, e) {
  return Y(t).pipe(to(e), eo(e));
}
function ud(t, e) {
  return Y(t).pipe(to(e), eo(e));
}
function dd(t, e) {
  return new R((r) => {
    let n = 0;
    return e.schedule(function () {
      n === t.length ? r.complete() : (r.next(t[n++]), r.closed || this.schedule());
    });
  });
}
function fd(t, e) {
  return new R((r) => {
    let n;
    return (
      Se(r, e, () => {
        (n = t[Ki]()),
          Se(
            r,
            e,
            () => {
              let i, o;
              try {
                ({ value: i, done: o } = n.next());
              } catch (s) {
                r.error(s);
                return;
              }
              o ? r.complete() : r.next(i);
            },
            0,
            !0,
          );
      }),
      () => E(n?.return) && n.return()
    );
  });
}
function no(t, e) {
  if (!t) throw new Error('Iterable cannot be null');
  return new R((r) => {
    Se(r, e, () => {
      let n = t[Symbol.asyncIterator]();
      Se(
        r,
        e,
        () => {
          n.next().then((i) => {
            i.done ? r.complete() : r.next(i.value);
          });
        },
        0,
        !0,
      );
    });
  });
}
function hd(t, e) {
  return no(Xi(t), e);
}
function pd(t, e) {
  if (t != null) {
    if (qi(t)) return ld(t, e);
    if (An(t)) return dd(t, e);
    if (Gi(t)) return ud(t, e);
    if (Yi(t)) return no(t, e);
    if (Qi(t)) return fd(t, e);
    if (Ji(t)) return hd(t, e);
  }
  throw Zi(t);
}
function ne(t, e) {
  return e ? pd(t, e) : Y(t);
}
function I(...t) {
  let e = et(t);
  return ne(t, e);
}
function Tn(t, e) {
  let r = E(t) ? t : () => t,
    n = (i) => i.error(r());
  return new R(e ? (i) => e.schedule(n, 0, i) : n);
}
function ro(t) {
  return !!t && (t instanceof R || (E(t.lift) && E(t.subscribe)));
}
var gt = wn(
  (t) =>
    function () {
      t(this), (this.name = 'EmptyError'), (this.message = 'no elements in sequence');
    },
);
function gd(t) {
  return t instanceof Date && !isNaN(t);
}
function V(t, e) {
  return N((r, n) => {
    let i = 0;
    r.subscribe(
      T(n, (o) => {
        n.next(t.call(e, o, i++));
      }),
    );
  });
}
var { isArray: zm } = Array;
function Wm(t, e) {
  return zm(e) ? t(...e) : t(e);
}
function On(t) {
  return V((e) => Wm(t, e));
}
var { isArray: Gm } = Array,
  { getPrototypeOf: qm, prototype: Ym, keys: Zm } = Object;
function io(t) {
  if (t.length === 1) {
    let e = t[0];
    if (Gm(e)) return { args: e, keys: null };
    if (Km(e)) {
      let r = Zm(e);
      return { args: r.map((n) => e[n]), keys: r };
    }
  }
  return { args: t, keys: null };
}
function Km(t) {
  return t && typeof t == 'object' && qm(t) === Ym;
}
function oo(t, e) {
  return t.reduce((r, n, i) => ((r[n] = e[i]), r), {});
}
function so(...t) {
  let e = et(t),
    r = Wi(t),
    { args: n, keys: i } = io(t);
  if (n.length === 0) return ne([], e);
  let o = new R(Qm(n, e, i ? (s) => oo(i, s) : _e));
  return r ? o.pipe(On(r)) : o;
}
function Qm(t, e, r = _e) {
  return (n) => {
    md(
      e,
      () => {
        let { length: i } = t,
          o = new Array(i),
          s = i,
          a = i;
        for (let c = 0; c < i; c++)
          md(
            e,
            () => {
              let l = ne(t[c], e),
                u = !1;
              l.subscribe(
                T(
                  n,
                  (d) => {
                    (o[c] = d), u || ((u = !0), a--), a || n.next(r(o.slice()));
                  },
                  () => {
                    --s || n.complete();
                  },
                ),
              );
            },
            n,
          );
      },
      n,
    );
  };
}
function md(t, e, r) {
  t ? Se(r, t, e) : e();
}
function vd(t, e, r, n, i, o, s, a) {
  let c = [],
    l = 0,
    u = 0,
    d = !1,
    f = () => {
      d && !c.length && !l && e.complete();
    },
    h = (w) => (l < n ? g(w) : c.push(w)),
    g = (w) => {
      o && e.next(w), l++;
      let H = !1;
      Y(r(w, u++)).subscribe(
        T(
          e,
          (F) => {
            i?.(F), o ? h(F) : e.next(F);
          },
          () => {
            H = !0;
          },
          void 0,
          () => {
            if (H)
              try {
                for (l--; c.length && l < n; ) {
                  let F = c.shift();
                  s ? Se(e, s, () => g(F)) : g(F);
                }
                f();
              } catch (F) {
                e.error(F);
              }
          },
        ),
      );
    };
  return (
    t.subscribe(
      T(e, h, () => {
        (d = !0), f();
      }),
    ),
    () => {
      a?.();
    }
  );
}
function ie(t, e, r = 1 / 0) {
  return E(e) ? ie((n, i) => V((o, s) => e(n, o, i, s))(Y(t(n, i))), r) : (typeof e == 'number' && (r = e), N((n, i) => vd(n, i, t, r)));
}
function xr(t = 1 / 0) {
  return ie(_e, t);
}
function yd() {
  return xr(1);
}
function Rn(...t) {
  return yd()(ne(t, et(t)));
}
function Nn(t) {
  return new R((e) => {
    Y(t()).subscribe(e);
  });
}
function ha(...t) {
  let e = Wi(t),
    { args: r, keys: n } = io(t),
    i = new R((o) => {
      let { length: s } = r;
      if (!s) {
        o.complete();
        return;
      }
      let a = new Array(s),
        c = s,
        l = s;
      for (let u = 0; u < s; u++) {
        let d = !1;
        Y(r[u]).subscribe(
          T(
            o,
            (f) => {
              d || ((d = !0), l--), (a[u] = f);
            },
            () => c--,
            void 0,
            () => {
              (!c || !d) && (l || o.next(n ? oo(n, a) : a), o.complete());
            },
          ),
        );
      }
    });
  return e ? i.pipe(On(e)) : i;
}
var Xm = ['addListener', 'removeListener'],
  Jm = ['addEventListener', 'removeEventListener'],
  ev = ['on', 'off'];
function Ar(t, e, r, n) {
  if ((E(r) && ((n = r), (r = void 0)), n)) return Ar(t, e, r).pipe(On(n));
  let [i, o] = rv(t) ? Jm.map((s) => (a) => t[s](e, a, r)) : tv(t) ? Xm.map(_d(t, e)) : nv(t) ? ev.map(_d(t, e)) : [];
  if (!i && An(t)) return ie((s) => Ar(s, e, r))(Y(t));
  if (!i) throw new TypeError('Invalid event target');
  return new R((s) => {
    let a = (...c) => s.next(1 < c.length ? c : c[0]);
    return i(a), () => o(a);
  });
}
function _d(t, e) {
  return (r) => (n) => t[r](e, n);
}
function tv(t) {
  return E(t.addListener) && E(t.removeListener);
}
function nv(t) {
  return E(t.on) && E(t.off);
}
function rv(t) {
  return E(t.addEventListener) && E(t.removeEventListener);
}
function Dd(t = 0, e, r = nd) {
  let n = -1;
  return (
    e != null && (zi(e) ? (r = e) : (n = e)),
    new R((i) => {
      let o = gd(t) ? +t - r.now() : t;
      o < 0 && (o = 0);
      let s = 0;
      return r.schedule(function () {
        i.closed || (i.next(s++), 0 <= n ? this.schedule(void 0, n) : i.complete());
      }, o);
    })
  );
}
function Tr(...t) {
  let e = et(t),
    r = rd(t, 1 / 0),
    n = t;
  return n.length ? (n.length === 1 ? Y(n[0]) : xr(r)(ne(n, e))) : Me;
}
function fe(t, e) {
  return N((r, n) => {
    let i = 0;
    r.subscribe(T(n, (o) => t.call(e, o, i++) && n.next(o)));
  });
}
function Cd(t) {
  return N((e, r) => {
    let n = !1,
      i = null,
      o = null,
      s = !1,
      a = () => {
        if ((o?.unsubscribe(), (o = null), n)) {
          n = !1;
          let l = i;
          (i = null), r.next(l);
        }
        s && r.complete();
      },
      c = () => {
        (o = null), s && r.complete();
      };
    e.subscribe(
      T(
        r,
        (l) => {
          (n = !0), (i = l), o || Y(t(l)).subscribe((o = T(r, a, c)));
        },
        () => {
          (s = !0), (!n || !o || o.closed) && r.complete();
        },
      ),
    );
  });
}
function ao(t, e = da) {
  return Cd(() => Dd(t, e));
}
function Tt(t) {
  return N((e, r) => {
    let n = null,
      i = !1,
      o;
    (n = e.subscribe(
      T(r, void 0, void 0, (s) => {
        (o = Y(t(s, Tt(t)(e)))), n ? (n.unsubscribe(), (n = null), o.subscribe(r)) : (i = !0);
      }),
    )),
      i && (n.unsubscribe(), (n = null), o.subscribe(r));
  });
}
function wd(t, e, r, n, i) {
  return (o, s) => {
    let a = r,
      c = e,
      l = 0;
    o.subscribe(
      T(
        s,
        (u) => {
          let d = l++;
          (c = a ? t(c, u, d) : ((a = !0), u)), n && s.next(c);
        },
        i &&
          (() => {
            a && s.next(c), s.complete();
          }),
      ),
    );
  };
}
function Pn(t, e) {
  return E(e) ? ie(t, e, 1) : ie(t, 1);
}
function Ot(t) {
  return N((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => {
          n || r.next(t), r.complete();
        },
      ),
    );
  });
}
function me(t) {
  return t <= 0
    ? () => Me
    : N((e, r) => {
        let n = 0;
        e.subscribe(
          T(r, (i) => {
            ++n <= t && (r.next(i), t <= n && r.complete());
          }),
        );
      });
}
function pa(t) {
  return V(() => t);
}
function Fn(t, e = _e) {
  return (
    (t = t ?? iv),
    N((r, n) => {
      let i,
        o = !0;
      r.subscribe(
        T(n, (s) => {
          let a = e(s);
          (o || !t(i, a)) && ((o = !1), (i = a), n.next(s));
        }),
      );
    })
  );
}
function iv(t, e) {
  return t === e;
}
function co(t = ov) {
  return N((e, r) => {
    let n = !1;
    e.subscribe(
      T(
        r,
        (i) => {
          (n = !0), r.next(i);
        },
        () => (n ? r.complete() : r.error(t())),
      ),
    );
  });
}
function ov() {
  return new gt();
}
function Or(t) {
  return N((e, r) => {
    try {
      e.subscribe(r);
    } finally {
      r.add(t);
    }
  });
}
function tt(t, e) {
  let r = arguments.length >= 2;
  return (n) => n.pipe(t ? fe((i, o) => t(i, o, n)) : _e, me(1), r ? Ot(e) : co(() => new gt()));
}
function kn(t) {
  return t <= 0
    ? () => Me
    : N((e, r) => {
        let n = [];
        e.subscribe(
          T(
            r,
            (i) => {
              n.push(i), t < n.length && n.shift();
            },
            () => {
              for (let i of n) r.next(i);
              r.complete();
            },
            void 0,
            () => {
              n = null;
            },
          ),
        );
      });
}
function ga(t, e) {
  let r = arguments.length >= 2;
  return (n) => n.pipe(t ? fe((i, o) => t(i, o, n)) : _e, kn(1), r ? Ot(e) : co(() => new gt()));
}
function ma(t, e) {
  return N(wd(t, e, arguments.length >= 2, !0));
}
function lo(t = {}) {
  let { connector: e = () => new $(), resetOnError: r = !0, resetOnComplete: n = !0, resetOnRefCountZero: i = !0 } = t;
  return (o) => {
    let s,
      a,
      c,
      l = 0,
      u = !1,
      d = !1,
      f = () => {
        a?.unsubscribe(), (a = void 0);
      },
      h = () => {
        f(), (s = c = void 0), (u = d = !1);
      },
      g = () => {
        let w = s;
        h(), w?.unsubscribe();
      };
    return N((w, H) => {
      l++, !d && !u && f();
      let F = (c = c ?? e());
      H.add(() => {
        l--, l === 0 && !d && !u && (a = va(g, i));
      }),
        F.subscribe(H),
        !s &&
          l > 0 &&
          ((s = new pt({
            next: (Ee) => F.next(Ee),
            error: (Ee) => {
              (d = !0), f(), (a = va(h, r, Ee)), F.error(Ee);
            },
            complete: () => {
              (u = !0), f(), (a = va(h, n)), F.complete();
            },
          })),
          Y(w).subscribe(s));
    })(o);
  };
}
function va(t, e, ...r) {
  if (e === !0) {
    t();
    return;
  }
  if (e === !1) return;
  let n = new pt({
    next: () => {
      n.unsubscribe(), t();
    },
  });
  return Y(e(...r)).subscribe(n);
}
function ya(t) {
  return fe((e, r) => t <= r);
}
function Ln(...t) {
  let e = et(t);
  return N((r, n) => {
    (e ? Rn(t, r, e) : Rn(t, r)).subscribe(n);
  });
}
function xe(t, e) {
  return N((r, n) => {
    let i = null,
      o = 0,
      s = !1,
      a = () => s && !i && n.complete();
    r.subscribe(
      T(
        n,
        (c) => {
          i?.unsubscribe();
          let l = 0,
            u = o++;
          Y(t(c, u)).subscribe(
            (i = T(
              n,
              (d) => n.next(e ? e(c, d, u, l++) : d),
              () => {
                (i = null), a();
              },
            )),
          );
        },
        () => {
          (s = !0), a();
        },
      ),
    );
  });
}
function nt(t) {
  return N((e, r) => {
    Y(t).subscribe(T(r, () => r.complete(), Mr)), !r.closed && e.subscribe(r);
  });
}
function _a(t, e = !1) {
  return N((r, n) => {
    let i = 0;
    r.subscribe(
      T(n, (o) => {
        let s = t(o, i++);
        (s || e) && n.next(o), !s && n.complete();
      }),
    );
  });
}
function ue(t, e, r) {
  let n = E(t) || e || r ? { next: t, error: e, complete: r } : t;
  return n
    ? N((i, o) => {
        var s;
        (s = n.subscribe) === null || s === void 0 || s.call(n);
        let a = !0;
        i.subscribe(
          T(
            o,
            (c) => {
              var l;
              (l = n.next) === null || l === void 0 || l.call(n, c), o.next(c);
            },
            () => {
              var c;
              (a = !1), (c = n.complete) === null || c === void 0 || c.call(n), o.complete();
            },
            (c) => {
              var l;
              (a = !1), (l = n.error) === null || l === void 0 || l.call(n, c), o.error(c);
            },
            () => {
              var c, l;
              a && ((c = n.unsubscribe) === null || c === void 0 || c.call(n)), (l = n.finalize) === null || l === void 0 || l.call(n);
            },
          ),
        );
      })
    : _e;
}
function Z(t) {
  for (let e in t) if (t[e] === Z) return e;
  throw Error('Could not find renamed property on target object.');
}
function uo(t, e) {
  for (let r in e) e.hasOwnProperty(r) && !t.hasOwnProperty(r) && (t[r] = e[r]);
}
function Ce(t) {
  if (typeof t == 'string') return t;
  if (Array.isArray(t)) return '[' + t.map(Ce).join(', ') + ']';
  if (t == null) return '' + t;
  if (t.overriddenName) return `${t.overriddenName}`;
  if (t.name) return `${t.name}`;
  let e = t.toString();
  if (e == null) return '' + e;
  let r = e.indexOf(`
`);
  return r === -1 ? e : e.substring(0, r);
}
function ka(t, e) {
  return t == null || t === '' ? (e === null ? '' : e) : e == null || e === '' ? t : t + ' ' + e;
}
var sv = Z({ __forward_ref__: Z });
function _t(t) {
  return (
    (t.__forward_ref__ = _t),
    (t.toString = function () {
      return Ce(this());
    }),
    t
  );
}
function De(t) {
  return nf(t) ? t() : t;
}
function nf(t) {
  return typeof t == 'function' && t.hasOwnProperty(sv) && t.__forward_ref__ === _t;
}
function rf(t) {
  return t && !!t.ɵproviders;
}
var av = 'https://g.co/ng/security#xss',
  M = class extends Error {
    constructor(e, r) {
      super(xc(e, r)), (this.code = e);
    }
  };
function xc(t, e) {
  return `${`NG0${Math.abs(t)}`}${e ? ': ' + e : ''}`;
}
var cv = Z({ ɵcmp: Z }),
  lv = Z({ ɵdir: Z }),
  uv = Z({ ɵpipe: Z }),
  dv = Z({ ɵmod: Z }),
  Do = Z({ ɵfac: Z }),
  Rr = Z({ __NG_ELEMENT_ID__: Z }),
  bd = Z({ __NG_ENV_ID__: Z });
function Pr(t) {
  return typeof t == 'string' ? t : t == null ? '' : String(t);
}
function fv(t) {
  return typeof t == 'function'
    ? t.name || t.toString()
    : typeof t == 'object' && t != null && typeof t.type == 'function'
      ? t.type.name || t.type.toString()
      : Pr(t);
}
function hv(t, e) {
  let r = e ? `. Dependency path: ${e.join(' > ')} > ${t}` : '';
  throw new M(-200, `Circular dependency in DI detected for ${t}${r}`);
}
function Ac(t, e) {
  let r = e ? ` in ${e}` : '';
  throw new M(-201, !1);
}
function pv(t, e) {
  t == null && gv(e, t, null, '!=');
}
function gv(t, e, r, n) {
  throw new Error(`ASSERTION ERROR: ${t}` + (n == null ? '' : ` [Expected=> ${r} ${n} ${e} <=Actual]`));
}
function y(t) {
  return { token: t.token, providedIn: t.providedIn || null, factory: t.factory, value: void 0 };
}
function oe(t) {
  return { providers: t.providers || [], imports: t.imports || [] };
}
function Bo(t) {
  return Ed(t, sf) || Ed(t, af);
}
function of(t) {
  return Bo(t) !== null;
}
function Ed(t, e) {
  return t.hasOwnProperty(e) ? t[e] : null;
}
function mv(t) {
  let e = t && (t[sf] || t[af]);
  return e || null;
}
function Id(t) {
  return t && (t.hasOwnProperty(Md) || t.hasOwnProperty(vv)) ? t[Md] : null;
}
var sf = Z({ ɵprov: Z }),
  Md = Z({ ɵinj: Z }),
  af = Z({ ngInjectableDef: Z }),
  vv = Z({ ngInjectorDef: Z }),
  L = (function (t) {
    return (
      (t[(t.Default = 0)] = 'Default'),
      (t[(t.Host = 1)] = 'Host'),
      (t[(t.Self = 2)] = 'Self'),
      (t[(t.SkipSelf = 4)] = 'SkipSelf'),
      (t[(t.Optional = 8)] = 'Optional'),
      t
    );
  })(L || {}),
  La;
function cf() {
  return La;
}
function rt(t) {
  let e = La;
  return (La = t), e;
}
function lf(t, e, r) {
  let n = Bo(t);
  if (n && n.providedIn == 'root') return n.value === void 0 ? (n.value = n.factory()) : n.value;
  if (r & L.Optional) return null;
  if (e !== void 0) return e;
  Ac(Ce(t), 'Injector');
}
var Nr = globalThis;
var b = class {
  constructor(e, r) {
    (this._desc = e),
      (this.ngMetadataName = 'InjectionToken'),
      (this.ɵprov = void 0),
      typeof r == 'number'
        ? (this.__NG_ELEMENT_ID__ = r)
        : r !== void 0 && (this.ɵprov = y({ token: this, providedIn: r.providedIn || 'root', factory: r.factory }));
  }
  get multi() {
    return this;
  }
  toString() {
    return `InjectionToken ${this._desc}`;
  }
};
var yv = {},
  Fr = yv,
  _v = '__NG_DI_FLAG__',
  Co = 'ngTempTokenPath',
  Dv = 'ngTokenPath',
  Cv = /\n/gm,
  wv = '\u0275',
  Sd = '__source',
  Un;
function bv() {
  return Un;
}
function Vn(t) {
  let e = Un;
  return (Un = t), e;
}
function Ev(t, e = L.Default) {
  if (Un === void 0) throw new M(-203, !1);
  return Un === null ? lf(t, void 0, e) : Un.get(t, e & L.Optional ? null : void 0, e);
}
function p(t, e = L.Default) {
  return (cf() || Ev)(De(t), e);
}
function _(t, e = L.Default) {
  return p(t, $o(e));
}
function $o(t) {
  return typeof t > 'u' || typeof t == 'number' ? t : 0 | (t.optional && 8) | (t.host && 1) | (t.self && 2) | (t.skipSelf && 4);
}
function Va(t) {
  let e = [];
  for (let r = 0; r < t.length; r++) {
    let n = De(t[r]);
    if (Array.isArray(n)) {
      if (n.length === 0) throw new M(900, !1);
      let i,
        o = L.Default;
      for (let s = 0; s < n.length; s++) {
        let a = n[s],
          c = Iv(a);
        typeof c == 'number' ? (c === -1 ? (i = a.token) : (o |= c)) : (i = a);
      }
      e.push(p(i, o));
    } else e.push(p(n));
  }
  return e;
}
function Iv(t) {
  return t[_v];
}
function Mv(t, e, r, n) {
  let i = t[Co];
  throw (
    (e[Sd] && i.unshift(e[Sd]),
    (t.message = Sv(
      `
` + t.message,
      i,
      r,
      n,
    )),
    (t[Dv] = i),
    (t[Co] = null),
    t)
  );
}
function Sv(t, e, r, n = null) {
  t =
    t &&
    t.charAt(0) ===
      `
` &&
    t.charAt(1) == wv
      ? t.slice(2)
      : t;
  let i = Ce(e);
  if (Array.isArray(e)) i = e.map(Ce).join(' -> ');
  else if (typeof e == 'object') {
    let o = [];
    for (let s in e)
      if (e.hasOwnProperty(s)) {
        let a = e[s];
        o.push(s + ':' + (typeof a == 'string' ? JSON.stringify(a) : Ce(a)));
      }
    i = `{${o.join(', ')}}`;
  }
  return `${r}${n ? '(' + n + ')' : ''}[${i}]: ${t.replace(
    Cv,
    `
  `,
  )}`;
}
function Uo(t) {
  return { toString: t }.toString();
}
var uf = (function (t) {
    return (t[(t.OnPush = 0)] = 'OnPush'), (t[(t.Default = 1)] = 'Default'), t;
  })(uf || {}),
  at = (function (t) {
    return (t[(t.Emulated = 0)] = 'Emulated'), (t[(t.None = 2)] = 'None'), (t[(t.ShadowDom = 3)] = 'ShadowDom'), t;
  })(at || {}),
  zn = {},
  Ae = [];
function df(t, e, r) {
  let n = t.length;
  for (;;) {
    let i = t.indexOf(e, r);
    if (i === -1) return i;
    if (i === 0 || t.charCodeAt(i - 1) <= 32) {
      let o = e.length;
      if (i + o === n || t.charCodeAt(i + o) <= 32) return i;
    }
    r = i + 1;
  }
}
function ja(t, e, r) {
  let n = 0;
  for (; n < r.length; ) {
    let i = r[n];
    if (typeof i == 'number') {
      if (i !== 0) break;
      n++;
      let o = r[n++],
        s = r[n++],
        a = r[n++];
      t.setAttribute(e, s, a, o);
    } else {
      let o = i,
        s = r[++n];
      Av(o) ? t.setProperty(e, o, s) : t.setAttribute(e, o, s), n++;
    }
  }
  return n;
}
function xv(t) {
  return t === 3 || t === 4 || t === 6;
}
function Av(t) {
  return t.charCodeAt(0) === 64;
}
function kr(t, e) {
  if (!(e === null || e.length === 0))
    if (t === null || t.length === 0) t = e.slice();
    else {
      let r = -1;
      for (let n = 0; n < e.length; n++) {
        let i = e[n];
        typeof i == 'number' ? (r = i) : r === 0 || (r === -1 || r === 2 ? xd(t, r, i, null, e[++n]) : xd(t, r, i, null, null));
      }
    }
  return t;
}
function xd(t, e, r, n, i) {
  let o = 0,
    s = t.length;
  if (e === -1) s = -1;
  else
    for (; o < t.length; ) {
      let a = t[o++];
      if (typeof a == 'number') {
        if (a === e) {
          s = -1;
          break;
        } else if (a > e) {
          s = o - 1;
          break;
        }
      }
    }
  for (; o < t.length; ) {
    let a = t[o];
    if (typeof a == 'number') break;
    if (a === r) {
      if (n === null) {
        i !== null && (t[o + 1] = i);
        return;
      } else if (n === t[o + 1]) {
        t[o + 2] = i;
        return;
      }
    }
    o++, n !== null && o++, i !== null && o++;
  }
  s !== -1 && (t.splice(s, 0, e), (o = s + 1)), t.splice(o++, 0, r), n !== null && t.splice(o++, 0, n), i !== null && t.splice(o++, 0, i);
}
var ff = 'ng-template';
function Tv(t, e, r) {
  let n = 0,
    i = !0;
  for (; n < t.length; ) {
    let o = t[n++];
    if (typeof o == 'string' && i) {
      let s = t[n++];
      if (r && o === 'class' && df(s.toLowerCase(), e, 0) !== -1) return !0;
    } else if (o === 1) {
      for (; n < t.length && typeof (o = t[n++]) == 'string'; ) if (o.toLowerCase() === e) return !0;
      return !1;
    } else typeof o == 'number' && (i = !1);
  }
  return !1;
}
function hf(t) {
  return t.type === 4 && t.value !== ff;
}
function Ov(t, e, r) {
  let n = t.type === 4 && !r ? ff : t.value;
  return e === n;
}
function Rv(t, e, r) {
  let n = 4,
    i = t.attrs || [],
    o = Fv(i),
    s = !1;
  for (let a = 0; a < e.length; a++) {
    let c = e[a];
    if (typeof c == 'number') {
      if (!s && !Ge(n) && !Ge(c)) return !1;
      if (s && Ge(c)) continue;
      (s = !1), (n = c | (n & 1));
      continue;
    }
    if (!s)
      if (n & 4) {
        if (((n = 2 | (n & 1)), (c !== '' && !Ov(t, c, r)) || (c === '' && e.length === 1))) {
          if (Ge(n)) return !1;
          s = !0;
        }
      } else {
        let l = n & 8 ? c : e[++a];
        if (n & 8 && t.attrs !== null) {
          if (!Tv(t.attrs, l, r)) {
            if (Ge(n)) return !1;
            s = !0;
          }
          continue;
        }
        let u = n & 8 ? 'class' : c,
          d = Nv(u, i, hf(t), r);
        if (d === -1) {
          if (Ge(n)) return !1;
          s = !0;
          continue;
        }
        if (l !== '') {
          let f;
          d > o ? (f = '') : (f = i[d + 1].toLowerCase());
          let h = n & 8 ? f : null;
          if ((h && df(h, l, 0) !== -1) || (n & 2 && l !== f)) {
            if (Ge(n)) return !1;
            s = !0;
          }
        }
      }
  }
  return Ge(n) || s;
}
function Ge(t) {
  return (t & 1) === 0;
}
function Nv(t, e, r, n) {
  if (e === null) return -1;
  let i = 0;
  if (n || !r) {
    let o = !1;
    for (; i < e.length; ) {
      let s = e[i];
      if (s === t) return i;
      if (s === 3 || s === 6) o = !0;
      else if (s === 1 || s === 2) {
        let a = e[++i];
        for (; typeof a == 'string'; ) a = e[++i];
        continue;
      } else {
        if (s === 4) break;
        if (s === 0) {
          i += 4;
          continue;
        }
      }
      i += o ? 1 : 2;
    }
    return -1;
  } else return kv(e, t);
}
function Pv(t, e, r = !1) {
  for (let n = 0; n < e.length; n++) if (Rv(t, e[n], r)) return !0;
  return !1;
}
function Fv(t) {
  for (let e = 0; e < t.length; e++) {
    let r = t[e];
    if (xv(r)) return e;
  }
  return t.length;
}
function kv(t, e) {
  let r = t.indexOf(4);
  if (r > -1)
    for (r++; r < t.length; ) {
      let n = t[r];
      if (typeof n == 'number') return -1;
      if (n === e) return r;
      r++;
    }
  return -1;
}
function Ad(t, e) {
  return t ? ':not(' + e.trim() + ')' : e;
}
function Lv(t) {
  let e = t[0],
    r = 1,
    n = 2,
    i = '',
    o = !1;
  for (; r < t.length; ) {
    let s = t[r];
    if (typeof s == 'string')
      if (n & 2) {
        let a = t[++r];
        i += '[' + s + (a.length > 0 ? '="' + a + '"' : '') + ']';
      } else n & 8 ? (i += '.' + s) : n & 4 && (i += ' ' + s);
    else i !== '' && !Ge(s) && ((e += Ad(o, i)), (i = '')), (n = s), (o = o || !Ge(n));
    r++;
  }
  return i !== '' && (e += Ad(o, i)), e;
}
function Vv(t) {
  return t.map(Lv).join(',');
}
function jv(t) {
  let e = [],
    r = [],
    n = 1,
    i = 2;
  for (; n < t.length; ) {
    let o = t[n];
    if (typeof o == 'string') i === 2 ? o !== '' && e.push(o, t[++n]) : i === 8 && r.push(o);
    else {
      if (!Ge(i)) break;
      i = o;
    }
    n++;
  }
  return { attrs: e, classes: r };
}
function K(t) {
  return Uo(() => {
    let e = yf(t),
      r = G(m({}, e), {
        decls: t.decls,
        vars: t.vars,
        template: t.template,
        consts: t.consts || null,
        ngContentSelectors: t.ngContentSelectors,
        onPush: t.changeDetection === uf.OnPush,
        directiveDefs: null,
        pipeDefs: null,
        dependencies: (e.standalone && t.dependencies) || null,
        getStandaloneInjector: null,
        signals: t.signals ?? !1,
        data: t.data || {},
        encapsulation: t.encapsulation || at.Emulated,
        styles: t.styles || Ae,
        _: null,
        schemas: t.schemas || null,
        tView: null,
        id: '',
      });
    _f(r);
    let n = t.dependencies;
    return (r.directiveDefs = Od(n, !1)), (r.pipeDefs = Od(n, !0)), (r.id = Uv(r)), r;
  });
}
function Bv(t) {
  return Yt(t) || pf(t);
}
function $v(t) {
  return t !== null;
}
function se(t) {
  return Uo(() => ({
    type: t.type,
    bootstrap: t.bootstrap || Ae,
    declarations: t.declarations || Ae,
    imports: t.imports || Ae,
    exports: t.exports || Ae,
    transitiveCompileScopes: null,
    schemas: t.schemas || null,
    id: t.id || null,
  }));
}
function Td(t, e) {
  if (t == null) return zn;
  let r = {};
  for (let n in t)
    if (t.hasOwnProperty(n)) {
      let i = t[n],
        o = i;
      Array.isArray(i) && ((o = i[1]), (i = i[0])), (r[i] = n), e && (e[i] = o);
    }
  return r;
}
function re(t) {
  return Uo(() => {
    let e = yf(t);
    return _f(e), e;
  });
}
function Yt(t) {
  return t[cv] || null;
}
function pf(t) {
  return t[lv] || null;
}
function gf(t) {
  return t[uv] || null;
}
function mf(t) {
  let e = Yt(t) || pf(t) || gf(t);
  return e !== null ? e.standalone : !1;
}
function vf(t, e) {
  let r = t[dv] || null;
  if (!r && e === !0) throw new Error(`Type ${Ce(t)} does not have '\u0275mod' property.`);
  return r;
}
function yf(t) {
  let e = {};
  return {
    type: t.type,
    providersResolver: null,
    factory: null,
    hostBindings: t.hostBindings || null,
    hostVars: t.hostVars || 0,
    hostAttrs: t.hostAttrs || null,
    contentQueries: t.contentQueries || null,
    declaredInputs: e,
    inputTransforms: null,
    inputConfig: t.inputs || zn,
    exportAs: t.exportAs || null,
    standalone: t.standalone === !0,
    signals: t.signals === !0,
    selectors: t.selectors || Ae,
    viewQuery: t.viewQuery || null,
    features: t.features || null,
    setInput: null,
    findHostDirectiveDefs: null,
    hostDirectives: null,
    inputs: Td(t.inputs, e),
    outputs: Td(t.outputs),
    debugInfo: null,
  };
}
function _f(t) {
  t.features?.forEach((e) => e(t));
}
function Od(t, e) {
  if (!t) return null;
  let r = e ? gf : Bv;
  return () => (typeof t == 'function' ? t() : t).map((n) => r(n)).filter($v);
}
function Uv(t) {
  let e = 0,
    r = [
      t.selectors,
      t.ngContentSelectors,
      t.hostVars,
      t.hostAttrs,
      t.consts,
      t.vars,
      t.decls,
      t.encapsulation,
      t.standalone,
      t.signals,
      t.exportAs,
      JSON.stringify(t.inputs),
      JSON.stringify(t.outputs),
      Object.getOwnPropertyNames(t.type.prototype),
      !!t.contentQueries,
      !!t.viewQuery,
    ].join('|');
  for (let i of r) e = (Math.imul(31, e) + i.charCodeAt(0)) << 0;
  return (e += 2147483647 + 1), 'c' + e;
}
var Dt = 0,
  O = 1,
  x = 2,
  ce = 3,
  Ye = 4,
  Xe = 5,
  wo = 6,
  Lr = 7,
  pe = 8,
  Wn = 9,
  Vr = 10,
  de = 11,
  jr = 12,
  Rd = 13,
  Qn = 14,
  Ze = 15,
  qr = 16,
  jn = 17,
  st = 18,
  Ho = 19,
  Df = 20,
  Rt = 21,
  Da = 22,
  Zt = 23,
  Le = 25,
  Cf = 1;
var Kt = 7,
  bo = 8,
  Gn = 9,
  ve = 10,
  qn = (function (t) {
    return (
      (t[(t.None = 0)] = 'None'),
      (t[(t.HasTransplantedViews = 2)] = 'HasTransplantedViews'),
      (t[(t.HasChildViewsToRefresh = 4)] = 'HasChildViewsToRefresh'),
      t
    );
  })(qn || {});
function Nt(t) {
  return Array.isArray(t) && typeof t[Cf] == 'object';
}
function Ke(t) {
  return Array.isArray(t) && t[Cf] === !0;
}
function wf(t) {
  return (t.flags & 4) !== 0;
}
function zo(t) {
  return t.componentOffset > -1;
}
function Tc(t) {
  return (t.flags & 1) === 1;
}
function Pt(t) {
  return !!t.template;
}
function Hv(t) {
  return (t[x] & 512) !== 0;
}
function Yn(t, e) {
  let r = t.hasOwnProperty(Do);
  return r ? t[Do] : null;
}
var Ba = class {
  constructor(e, r, n) {
    (this.previousValue = e), (this.currentValue = r), (this.firstChange = n);
  }
  isFirstChange() {
    return this.firstChange;
  }
};
function ye() {
  return bf;
}
function bf(t) {
  return t.type.prototype.ngOnChanges && (t.setInput = Wv), zv;
}
ye.ngInherit = !0;
function zv() {
  let t = If(this),
    e = t?.current;
  if (e) {
    let r = t.previous;
    if (r === zn) t.previous = e;
    else for (let n in e) r[n] = e[n];
    (t.current = null), this.ngOnChanges(e);
  }
}
function Wv(t, e, r, n) {
  let i = this.declaredInputs[r],
    o = If(t) || Gv(t, { previous: zn, current: null }),
    s = o.current || (o.current = {}),
    a = o.previous,
    c = a[i];
  (s[i] = new Ba(c && c.currentValue, e, a === zn)), (t[n] = e);
}
var Ef = '__ngSimpleChanges__';
function If(t) {
  return t[Ef] || null;
}
function Gv(t, e) {
  return (t[Ef] = e);
}
var Nd = null;
var it = function (t, e, r) {
    Nd?.(t, e, r);
  },
  qv = 'svg',
  Yv = 'math';
function ct(t) {
  for (; Array.isArray(t); ) t = t[Dt];
  return t;
}
function Mf(t, e) {
  return ct(e[t]);
}
function je(t, e) {
  return ct(e[t.index]);
}
function Oc(t, e) {
  return t.data[e];
}
function Zv(t, e) {
  return t[e];
}
function kt(t, e) {
  let r = e[t];
  return Nt(r) ? r : r[Dt];
}
function Kv(t) {
  return (t[x] & 4) === 4;
}
function Rc(t) {
  return (t[x] & 128) === 128;
}
function Qv(t) {
  return Ke(t[ce]);
}
function Eo(t, e) {
  return e == null ? null : t[e];
}
function Sf(t) {
  t[jn] = 0;
}
function Xv(t) {
  t[x] & 1024 || ((t[x] |= 1024), Rc(t) && Wo(t));
}
function Jv(t, e) {
  for (; t > 0; ) (e = e[Qn]), t--;
  return e;
}
function xf(t) {
  t[x] & 9216 && Wo(t);
}
function Wo(t) {
  let e = t[ce];
  for (; e !== null && !((Ke(e) && e[x] & qn.HasChildViewsToRefresh) || (Nt(e) && e[x] & 8192)); ) {
    if (Ke(e)) e[x] |= qn.HasChildViewsToRefresh;
    else if (((e[x] |= 8192), !Rc(e))) break;
    e = e[ce];
  }
}
function Af(t, e) {
  if ((t[x] & 256) === 256) throw new M(911, !1);
  t[Rt] === null && (t[Rt] = []), t[Rt].push(e);
}
function ey(t, e) {
  if (t[Rt] === null) return;
  let r = t[Rt].indexOf(e);
  r !== -1 && t[Rt].splice(r, 1);
}
var k = { lFrame: kf(null), bindingsEnabled: !0, skipHydrationRootTNode: null };
function ty() {
  return k.lFrame.elementDepthCount;
}
function ny() {
  k.lFrame.elementDepthCount++;
}
function ry() {
  k.lFrame.elementDepthCount--;
}
function Tf() {
  return k.bindingsEnabled;
}
function iy() {
  return k.skipHydrationRootTNode !== null;
}
function oy(t) {
  return k.skipHydrationRootTNode === t;
}
function sy() {
  k.skipHydrationRootTNode = null;
}
function z() {
  return k.lFrame.lView;
}
function Oe() {
  return k.lFrame.tView;
}
function Xn(t) {
  return (k.lFrame.contextLView = t), t[pe];
}
function Jn(t) {
  return (k.lFrame.contextLView = null), t;
}
function Be() {
  let t = Of();
  for (; t !== null && t.type === 64; ) t = t.parent;
  return t;
}
function Of() {
  return k.lFrame.currentTNode;
}
function ay() {
  let t = k.lFrame,
    e = t.currentTNode;
  return t.isParent ? e : e.parent;
}
function Yr(t, e) {
  let r = k.lFrame;
  (r.currentTNode = t), (r.isParent = e);
}
function Rf() {
  return k.lFrame.isParent;
}
function cy() {
  k.lFrame.isParent = !1;
}
function ly() {
  return k.lFrame.contextLView;
}
function uy() {
  return k.lFrame.bindingIndex;
}
function dy(t) {
  return (k.lFrame.bindingIndex = t);
}
function Zr() {
  return k.lFrame.bindingIndex++;
}
function Nc(t) {
  let e = k.lFrame,
    r = e.bindingIndex;
  return (e.bindingIndex = e.bindingIndex + t), r;
}
function fy() {
  return k.lFrame.inI18n;
}
function hy(t, e) {
  let r = k.lFrame;
  (r.bindingIndex = r.bindingRootIndex = t), $a(e);
}
function py() {
  return k.lFrame.currentDirectiveIndex;
}
function $a(t) {
  k.lFrame.currentDirectiveIndex = t;
}
function gy(t) {
  let e = k.lFrame.currentDirectiveIndex;
  return e === -1 ? null : t[e];
}
function Nf() {
  return k.lFrame.currentQueryIndex;
}
function Pc(t) {
  k.lFrame.currentQueryIndex = t;
}
function my(t) {
  let e = t[O];
  return e.type === 2 ? e.declTNode : e.type === 1 ? t[Xe] : null;
}
function Pf(t, e, r) {
  if (r & L.SkipSelf) {
    let i = e,
      o = t;
    for (; (i = i.parent), i === null && !(r & L.Host); ) if (((i = my(o)), i === null || ((o = o[Qn]), i.type & 10))) break;
    if (i === null) return !1;
    (e = i), (t = o);
  }
  let n = (k.lFrame = Ff());
  return (n.currentTNode = e), (n.lView = t), !0;
}
function Fc(t) {
  let e = Ff(),
    r = t[O];
  (k.lFrame = e),
    (e.currentTNode = r.firstChild),
    (e.lView = t),
    (e.tView = r),
    (e.contextLView = t),
    (e.bindingIndex = r.bindingStartIndex),
    (e.inI18n = !1);
}
function Ff() {
  let t = k.lFrame,
    e = t === null ? null : t.child;
  return e === null ? kf(t) : e;
}
function kf(t) {
  let e = {
    currentTNode: null,
    isParent: !0,
    lView: null,
    tView: null,
    selectedIndex: -1,
    contextLView: null,
    elementDepthCount: 0,
    currentNamespace: null,
    currentDirectiveIndex: -1,
    bindingRootIndex: -1,
    bindingIndex: -1,
    currentQueryIndex: 0,
    parent: t,
    child: null,
    inI18n: !1,
  };
  return t !== null && (t.child = e), e;
}
function Lf() {
  let t = k.lFrame;
  return (k.lFrame = t.parent), (t.currentTNode = null), (t.lView = null), t;
}
var Vf = Lf;
function kc() {
  let t = Lf();
  (t.isParent = !0),
    (t.tView = null),
    (t.selectedIndex = -1),
    (t.contextLView = null),
    (t.elementDepthCount = 0),
    (t.currentDirectiveIndex = -1),
    (t.currentNamespace = null),
    (t.bindingRootIndex = -1),
    (t.bindingIndex = -1),
    (t.currentQueryIndex = 0);
}
function vy(t) {
  return (k.lFrame.contextLView = Jv(t, k.lFrame.contextLView))[pe];
}
function Ct() {
  return k.lFrame.selectedIndex;
}
function Qt(t) {
  k.lFrame.selectedIndex = t;
}
function jf() {
  let t = k.lFrame;
  return Oc(t.tView, t.selectedIndex);
}
function yy() {
  return k.lFrame.currentNamespace;
}
var Bf = !0;
function Lc() {
  return Bf;
}
function Vc(t) {
  Bf = t;
}
function _y(t, e, r) {
  let { ngOnChanges: n, ngOnInit: i, ngDoCheck: o } = e.type.prototype;
  if (n) {
    let s = bf(e);
    (r.preOrderHooks ??= []).push(t, s), (r.preOrderCheckHooks ??= []).push(t, s);
  }
  i && (r.preOrderHooks ??= []).push(0 - t, i), o && ((r.preOrderHooks ??= []).push(t, o), (r.preOrderCheckHooks ??= []).push(t, o));
}
function jc(t, e) {
  for (let r = e.directiveStart, n = e.directiveEnd; r < n; r++) {
    let o = t.data[r].type.prototype,
      { ngAfterContentInit: s, ngAfterContentChecked: a, ngAfterViewInit: c, ngAfterViewChecked: l, ngOnDestroy: u } = o;
    s && (t.contentHooks ??= []).push(-r, s),
      a && ((t.contentHooks ??= []).push(r, a), (t.contentCheckHooks ??= []).push(r, a)),
      c && (t.viewHooks ??= []).push(-r, c),
      l && ((t.viewHooks ??= []).push(r, l), (t.viewCheckHooks ??= []).push(r, l)),
      u != null && (t.destroyHooks ??= []).push(r, u);
  }
}
function po(t, e, r) {
  $f(t, e, 3, r);
}
function go(t, e, r, n) {
  (t[x] & 3) === r && $f(t, e, r, n);
}
function Ca(t, e) {
  let r = t[x];
  (r & 3) === e && ((r &= 16383), (r += 1), (t[x] = r));
}
function $f(t, e, r, n) {
  let i = n !== void 0 ? t[jn] & 65535 : 0,
    o = n ?? -1,
    s = e.length - 1,
    a = 0;
  for (let c = i; c < s; c++)
    if (typeof e[c + 1] == 'number') {
      if (((a = e[c]), n != null && a >= n)) break;
    } else e[c] < 0 && (t[jn] += 65536), (a < o || o == -1) && (Dy(t, r, e, c), (t[jn] = (t[jn] & 4294901760) + c + 2)), c++;
}
function Pd(t, e) {
  it(4, t, e);
  let r = he(null);
  try {
    e.call(t);
  } finally {
    he(r), it(5, t, e);
  }
}
function Dy(t, e, r, n) {
  let i = r[n] < 0,
    o = r[n + 1],
    s = i ? -r[n] : r[n],
    a = t[s];
  i ? t[x] >> 14 < t[jn] >> 16 && (t[x] & 3) === e && ((t[x] += 16384), Pd(a, o)) : Pd(a, o);
}
var Hn = -1,
  Xt = class {
    constructor(e, r, n) {
      (this.factory = e), (this.resolving = !1), (this.canSeeViewProviders = r), (this.injectImpl = n);
    }
  };
function Cy(t) {
  return t instanceof Xt;
}
function wy(t) {
  return (t.flags & 8) !== 0;
}
function by(t) {
  return (t.flags & 16) !== 0;
}
function Uf(t) {
  return t !== Hn;
}
function Io(t) {
  let e = t & 32767;
  return t & 32767;
}
function Ey(t) {
  return t >> 16;
}
function Mo(t, e) {
  let r = Ey(t),
    n = e;
  for (; r > 0; ) (n = n[Qn]), r--;
  return n;
}
var Ua = !0;
function Fd(t) {
  let e = Ua;
  return (Ua = t), e;
}
var Iy = 256,
  Hf = Iy - 1,
  zf = 5,
  My = 0,
  ot = {};
function Sy(t, e, r) {
  let n;
  typeof r == 'string' ? (n = r.charCodeAt(0) || 0) : r.hasOwnProperty(Rr) && (n = r[Rr]), n == null && (n = r[Rr] = My++);
  let i = n & Hf,
    o = 1 << i;
  e.data[t + (i >> zf)] |= o;
}
function So(t, e) {
  let r = Wf(t, e);
  if (r !== -1) return r;
  let n = e[O];
  n.firstCreatePass && ((t.injectorIndex = e.length), wa(n.data, t), wa(e, null), wa(n.blueprint, null));
  let i = Bc(t, e),
    o = t.injectorIndex;
  if (Uf(i)) {
    let s = Io(i),
      a = Mo(i, e),
      c = a[O].data;
    for (let l = 0; l < 8; l++) e[o + l] = a[s + l] | c[s + l];
  }
  return (e[o + 8] = i), o;
}
function wa(t, e) {
  t.push(0, 0, 0, 0, 0, 0, 0, 0, e);
}
function Wf(t, e) {
  return t.injectorIndex === -1 || (t.parent && t.parent.injectorIndex === t.injectorIndex) || e[t.injectorIndex + 8] === null
    ? -1
    : t.injectorIndex;
}
function Bc(t, e) {
  if (t.parent && t.parent.injectorIndex !== -1) return t.parent.injectorIndex;
  let r = 0,
    n = null,
    i = e;
  for (; i !== null; ) {
    if (((n = Kf(i)), n === null)) return Hn;
    if ((r++, (i = i[Qn]), n.injectorIndex !== -1)) return n.injectorIndex | (r << 16);
  }
  return Hn;
}
function Ha(t, e, r) {
  Sy(t, e, r);
}
function Gf(t, e, r) {
  if (r & L.Optional || t !== void 0) return t;
  Ac(e, 'NodeInjector');
}
function qf(t, e, r, n) {
  if ((r & L.Optional && n === void 0 && (n = null), !(r & (L.Self | L.Host)))) {
    let i = t[Wn],
      o = rt(void 0);
    try {
      return i ? i.get(e, n, r & L.Optional) : lf(e, n, r & L.Optional);
    } finally {
      rt(o);
    }
  }
  return Gf(n, e, r);
}
function Yf(t, e, r, n = L.Default, i) {
  if (t !== null) {
    if (e[x] & 2048 && !(n & L.Self)) {
      let s = Oy(t, e, r, n, ot);
      if (s !== ot) return s;
    }
    let o = Zf(t, e, r, n, ot);
    if (o !== ot) return o;
  }
  return qf(e, r, n, i);
}
function Zf(t, e, r, n, i) {
  let o = Ay(r);
  if (typeof o == 'function') {
    if (!Pf(e, t, n)) return n & L.Host ? Gf(i, r, n) : qf(e, r, n, i);
    try {
      let s;
      if (((s = o(n)), s == null && !(n & L.Optional))) Ac(r);
      else return s;
    } finally {
      Vf();
    }
  } else if (typeof o == 'number') {
    let s = null,
      a = Wf(t, e),
      c = Hn,
      l = n & L.Host ? e[Ze][Xe] : null;
    for (
      (a === -1 || n & L.SkipSelf) &&
      ((c = a === -1 ? Bc(t, e) : e[a + 8]), c === Hn || !Ld(n, !1) ? (a = -1) : ((s = e[O]), (a = Io(c)), (e = Mo(c, e))));
      a !== -1;

    ) {
      let u = e[O];
      if (kd(o, a, u.data)) {
        let d = xy(a, e, r, s, n, l);
        if (d !== ot) return d;
      }
      (c = e[a + 8]), c !== Hn && Ld(n, e[O].data[a + 8] === l) && kd(o, a, e) ? ((s = u), (a = Io(c)), (e = Mo(c, e))) : (a = -1);
    }
  }
  return i;
}
function xy(t, e, r, n, i, o) {
  let s = e[O],
    a = s.data[t + 8],
    c = n == null ? zo(a) && Ua : n != s && (a.type & 3) !== 0,
    l = i & L.Host && o === a,
    u = mo(a, s, r, c, l);
  return u !== null ? Jt(e, s, u, a) : ot;
}
function mo(t, e, r, n, i) {
  let o = t.providerIndexes,
    s = e.data,
    a = o & 1048575,
    c = t.directiveStart,
    l = t.directiveEnd,
    u = o >> 20,
    d = n ? a : a + u,
    f = i ? a + u : l;
  for (let h = d; h < f; h++) {
    let g = s[h];
    if ((h < c && r === g) || (h >= c && g.type === r)) return h;
  }
  if (i) {
    let h = s[c];
    if (h && Pt(h) && h.type === r) return c;
  }
  return null;
}
function Jt(t, e, r, n) {
  let i = t[r],
    o = e.data;
  if (Cy(i)) {
    let s = i;
    s.resolving && hv(fv(o[r]));
    let a = Fd(s.canSeeViewProviders);
    s.resolving = !0;
    let c,
      l = s.injectImpl ? rt(s.injectImpl) : null,
      u = Pf(t, n, L.Default);
    try {
      (i = t[r] = s.factory(void 0, o, t, n)), e.firstCreatePass && r >= n.directiveStart && _y(r, o[r], e);
    } finally {
      l !== null && rt(l), Fd(a), (s.resolving = !1), Vf();
    }
  }
  return i;
}
function Ay(t) {
  if (typeof t == 'string') return t.charCodeAt(0) || 0;
  let e = t.hasOwnProperty(Rr) ? t[Rr] : void 0;
  return typeof e == 'number' ? (e >= 0 ? e & Hf : Ty) : e;
}
function kd(t, e, r) {
  let n = 1 << t;
  return !!(r[e + (t >> zf)] & n);
}
function Ld(t, e) {
  return !(t & L.Self) && !(t & L.Host && e);
}
var qt = class {
  constructor(e, r) {
    (this._tNode = e), (this._lView = r);
  }
  get(e, r, n) {
    return Yf(this._tNode, this._lView, e, $o(n), r);
  }
};
function Ty() {
  return new qt(Be(), z());
}
function er(t) {
  return Uo(() => {
    let e = t.prototype.constructor,
      r = e[Do] || za(e),
      n = Object.prototype,
      i = Object.getPrototypeOf(t.prototype).constructor;
    for (; i && i !== n; ) {
      let o = i[Do] || za(i);
      if (o && o !== r) return o;
      i = Object.getPrototypeOf(i);
    }
    return (o) => new o();
  });
}
function za(t) {
  return nf(t)
    ? () => {
        let e = za(De(t));
        return e && e();
      }
    : Yn(t);
}
function Oy(t, e, r, n, i) {
  let o = t,
    s = e;
  for (; o !== null && s !== null && s[x] & 2048 && !(s[x] & 512); ) {
    let a = Zf(o, s, r, n | L.Self, ot);
    if (a !== ot) return a;
    let c = o.parent;
    if (!c) {
      let l = s[Df];
      if (l) {
        let u = l.get(r, ot, n);
        if (u !== ot) return u;
      }
      (c = Kf(s)), (s = s[Qn]);
    }
    o = c;
  }
  return i;
}
function Kf(t) {
  let e = t[O],
    r = e.type;
  return r === 2 ? e.declTNode : r === 1 ? t[Xe] : null;
}
function Ry(t) {
  return typeof t == 'function';
}
function Ny(t, e, r) {
  if (t.length !== e.length) return !1;
  for (let n = 0; n < t.length; n++) {
    let i = t[n],
      o = e[n];
    if ((r && ((i = r(i)), (o = r(o))), o !== i)) return !1;
  }
  return !0;
}
function Py(t) {
  return t.flat(Number.POSITIVE_INFINITY);
}
function $c(t, e) {
  t.forEach((r) => (Array.isArray(r) ? $c(r, e) : e(r)));
}
function Qf(t, e, r) {
  e >= t.length ? t.push(r) : t.splice(e, 0, r);
}
function xo(t, e) {
  return e >= t.length - 1 ? t.pop() : t.splice(e, 1)[0];
}
function Fy(t, e) {
  let r = [];
  for (let n = 0; n < t; n++) r.push(e);
  return r;
}
function ky(t, e, r, n) {
  let i = t.length;
  if (i == e) t.push(r, n);
  else if (i === 1) t.push(n, t[0]), (t[0] = r);
  else {
    for (i--, t.push(t[i - 1], t[i]); i > e; ) {
      let o = i - 2;
      (t[i] = t[o]), i--;
    }
    (t[e] = r), (t[e + 1] = n);
  }
}
function Uc(t, e, r) {
  let n = Kr(t, e);
  return n >= 0 ? (t[n | 1] = r) : ((n = ~n), ky(t, n, e, r)), n;
}
function ba(t, e) {
  let r = Kr(t, e);
  if (r >= 0) return t[r | 1];
}
function Kr(t, e) {
  return Ly(t, e, 1);
}
function Ly(t, e, r) {
  let n = 0,
    i = t.length >> r;
  for (; i !== n; ) {
    let o = n + ((i - n) >> 1),
      s = t[o << r];
    if (e === s) return o << r;
    s > e ? (i = o) : (n = o + 1);
  }
  return ~(i << r);
}
var Qr = new b('ENVIRONMENT_INITIALIZER'),
  Xf = new b('INJECTOR', -1),
  Jf = new b('INJECTOR_DEF_TYPES'),
  Ao = class {
    get(e, r = Fr) {
      if (r === Fr) {
        let n = new Error(`NullInjectorError: No provider for ${Ce(e)}!`);
        throw ((n.name = 'NullInjectorError'), n);
      }
      return r;
    }
  };
function Go(t) {
  return { ɵproviders: t };
}
function Vy(...t) {
  return { ɵproviders: eh(!0, t), ɵfromNgModule: !0 };
}
function eh(t, ...e) {
  let r = [],
    n = new Set(),
    i,
    o = (s) => {
      r.push(s);
    };
  return (
    $c(e, (s) => {
      let a = s;
      Wa(a, o, [], n) && ((i ||= []), i.push(a));
    }),
    i !== void 0 && th(i, o),
    r
  );
}
function th(t, e) {
  for (let r = 0; r < t.length; r++) {
    let { ngModule: n, providers: i } = t[r];
    Hc(i, (o) => {
      e(o, n);
    });
  }
}
function Wa(t, e, r, n) {
  if (((t = De(t)), !t)) return !1;
  let i = null,
    o = Id(t),
    s = !o && Yt(t);
  if (!o && !s) {
    let c = t.ngModule;
    if (((o = Id(c)), o)) i = c;
    else return !1;
  } else {
    if (s && !s.standalone) return !1;
    i = t;
  }
  let a = n.has(i);
  if (s) {
    if (a) return !1;
    if ((n.add(i), s.dependencies)) {
      let c = typeof s.dependencies == 'function' ? s.dependencies() : s.dependencies;
      for (let l of c) Wa(l, e, r, n);
    }
  } else if (o) {
    if (o.imports != null && !a) {
      n.add(i);
      let l;
      try {
        $c(o.imports, (u) => {
          Wa(u, e, r, n) && ((l ||= []), l.push(u));
        });
      } finally {
      }
      l !== void 0 && th(l, e);
    }
    if (!a) {
      let l = Yn(i) || (() => new i());
      e({ provide: i, useFactory: l, deps: Ae }, i),
        e({ provide: Jf, useValue: i, multi: !0 }, i),
        e({ provide: Qr, useValue: () => p(i), multi: !0 }, i);
    }
    let c = o.providers;
    if (c != null && !a) {
      let l = t;
      Hc(c, (u) => {
        e(u, l);
      });
    }
  } else return !1;
  return i !== t && t.providers !== void 0;
}
function Hc(t, e) {
  for (let r of t) rf(r) && (r = r.ɵproviders), Array.isArray(r) ? Hc(r, e) : e(r);
}
var jy = Z({ provide: String, useValue: Z });
function nh(t) {
  return t !== null && typeof t == 'object' && jy in t;
}
function By(t) {
  return !!(t && t.useExisting);
}
function $y(t) {
  return !!(t && t.useFactory);
}
function Zn(t) {
  return typeof t == 'function';
}
function Uy(t) {
  return !!t.useClass;
}
var qo = new b('Set Injector scope.'),
  vo = {},
  Hy = {},
  Ea;
function zc() {
  return Ea === void 0 && (Ea = new Ao()), Ea;
}
var Ve = class {},
  To = class extends Ve {
    get destroyed() {
      return this._destroyed;
    }
    constructor(e, r, n, i) {
      super(),
        (this.parent = r),
        (this.source = n),
        (this.scopes = i),
        (this.records = new Map()),
        (this._ngOnDestroyHooks = new Set()),
        (this._onDestroyHooks = []),
        (this._destroyed = !1),
        qa(e, (s) => this.processProvider(s)),
        this.records.set(Xf, Bn(void 0, this)),
        i.has('environment') && this.records.set(Ve, Bn(void 0, this));
      let o = this.records.get(qo);
      o != null && typeof o.value == 'string' && this.scopes.add(o.value), (this.injectorDefTypes = new Set(this.get(Jf, Ae, L.Self)));
    }
    destroy() {
      this.assertNotDestroyed(), (this._destroyed = !0);
      try {
        for (let r of this._ngOnDestroyHooks) r.ngOnDestroy();
        let e = this._onDestroyHooks;
        this._onDestroyHooks = [];
        for (let r of e) r();
      } finally {
        this.records.clear(), this._ngOnDestroyHooks.clear(), this.injectorDefTypes.clear();
      }
    }
    onDestroy(e) {
      return this.assertNotDestroyed(), this._onDestroyHooks.push(e), () => this.removeOnDestroy(e);
    }
    runInContext(e) {
      this.assertNotDestroyed();
      let r = Vn(this),
        n = rt(void 0),
        i;
      try {
        return e();
      } finally {
        Vn(r), rt(n);
      }
    }
    get(e, r = Fr, n = L.Default) {
      if ((this.assertNotDestroyed(), e.hasOwnProperty(bd))) return e[bd](this);
      n = $o(n);
      let i,
        o = Vn(this),
        s = rt(void 0);
      try {
        if (!(n & L.SkipSelf)) {
          let c = this.records.get(e);
          if (c === void 0) {
            let l = Yy(e) && Bo(e);
            l && this.injectableDefInScope(l) ? (c = Bn(Ga(e), vo)) : (c = null), this.records.set(e, c);
          }
          if (c != null) return this.hydrate(e, c);
        }
        let a = n & L.Self ? zc() : this.parent;
        return (r = n & L.Optional && r === Fr ? null : r), a.get(e, r);
      } catch (a) {
        if (a.name === 'NullInjectorError') {
          if (((a[Co] = a[Co] || []).unshift(Ce(e)), o)) throw a;
          return Mv(a, e, 'R3InjectorError', this.source);
        } else throw a;
      } finally {
        rt(s), Vn(o);
      }
    }
    resolveInjectorInitializers() {
      let e = Vn(this),
        r = rt(void 0),
        n;
      try {
        let i = this.get(Qr, Ae, L.Self);
        for (let o of i) o();
      } finally {
        Vn(e), rt(r);
      }
    }
    toString() {
      let e = [],
        r = this.records;
      for (let n of r.keys()) e.push(Ce(n));
      return `R3Injector[${e.join(', ')}]`;
    }
    assertNotDestroyed() {
      if (this._destroyed) throw new M(205, !1);
    }
    processProvider(e) {
      e = De(e);
      let r = Zn(e) ? e : De(e && e.provide),
        n = Wy(e);
      if (!Zn(e) && e.multi === !0) {
        let i = this.records.get(r);
        i || ((i = Bn(void 0, vo, !0)), (i.factory = () => Va(i.multi)), this.records.set(r, i)), (r = e), i.multi.push(e);
      } else {
        let i = this.records.get(r);
      }
      this.records.set(r, n);
    }
    hydrate(e, r) {
      return (
        r.value === vo && ((r.value = Hy), (r.value = r.factory())),
        typeof r.value == 'object' && r.value && qy(r.value) && this._ngOnDestroyHooks.add(r.value),
        r.value
      );
    }
    injectableDefInScope(e) {
      if (!e.providedIn) return !1;
      let r = De(e.providedIn);
      return typeof r == 'string' ? r === 'any' || this.scopes.has(r) : this.injectorDefTypes.has(r);
    }
    removeOnDestroy(e) {
      let r = this._onDestroyHooks.indexOf(e);
      r !== -1 && this._onDestroyHooks.splice(r, 1);
    }
  };
function Ga(t) {
  let e = Bo(t),
    r = e !== null ? e.factory : Yn(t);
  if (r !== null) return r;
  if (t instanceof b) throw new M(204, !1);
  if (t instanceof Function) return zy(t);
  throw new M(204, !1);
}
function zy(t) {
  let e = t.length;
  if (e > 0) {
    let n = Fy(e, '?');
    throw new M(204, !1);
  }
  let r = mv(t);
  return r !== null ? () => r.factory(t) : () => new t();
}
function Wy(t) {
  if (nh(t)) return Bn(void 0, t.useValue);
  {
    let e = rh(t);
    return Bn(e, vo);
  }
}
function rh(t, e, r) {
  let n;
  if (Zn(t)) {
    let i = De(t);
    return Yn(i) || Ga(i);
  } else if (nh(t)) n = () => De(t.useValue);
  else if ($y(t)) n = () => t.useFactory(...Va(t.deps || []));
  else if (By(t)) n = () => p(De(t.useExisting));
  else {
    let i = De(t && (t.useClass || t.provide));
    if (Gy(t)) n = () => new i(...Va(t.deps));
    else return Yn(i) || Ga(i);
  }
  return n;
}
function Bn(t, e, r = !1) {
  return { factory: t, value: e, multi: r ? [] : void 0 };
}
function Gy(t) {
  return !!t.deps;
}
function qy(t) {
  return t !== null && typeof t == 'object' && typeof t.ngOnDestroy == 'function';
}
function Yy(t) {
  return typeof t == 'function' || (typeof t == 'object' && t instanceof b);
}
function qa(t, e) {
  for (let r of t) Array.isArray(r) ? qa(r, e) : r && rf(r) ? qa(r.ɵproviders, e) : e(r);
}
function ih(t) {
  if (!cf() && !bv()) throw new M(-203, !1);
}
function Vd(t, e = null, r = null, n) {
  let i = oh(t, e, r, n);
  return i.resolveInjectorInitializers(), i;
}
function oh(t, e = null, r = null, n, i = new Set()) {
  let o = [r || Ae, Vy(t)];
  return (n = n || (typeof t == 'object' ? void 0 : Ce(t))), new To(o, e || zc(), n || null, i);
}
var ge = (() => {
  let e = class e {
    static create(n, i) {
      if (Array.isArray(n)) return Vd({ name: '' }, i, n, '');
      {
        let o = n.name ?? '';
        return Vd({ name: o }, n.parent, n.providers, o);
      }
    }
  };
  (e.THROW_IF_NOT_FOUND = Fr),
    (e.NULL = new Ao()),
    (e.ɵprov = y({ token: e, providedIn: 'any', factory: () => p(Xf) })),
    (e.__NG_ELEMENT_ID__ = -1);
  let t = e;
  return t;
})();
var Ya;
function sh(t) {
  Ya = t;
}
function Zy() {
  if (Ya !== void 0) return Ya;
  if (typeof document < 'u') return document;
  throw new M(210, !1);
}
var Yo = new b('AppId', { providedIn: 'root', factory: () => Ky }),
  Ky = 'ng',
  Wc = new b('Platform Initializer'),
  $e = new b('Platform ID', { providedIn: 'platform', factory: () => 'unknown' });
var ah = new b('AnimationModuleType'),
  Gc = new b('CSP nonce', {
    providedIn: 'root',
    factory: () => Zy().body?.querySelector('[ngCspNonce]')?.getAttribute('ngCspNonce') || null,
  });
function ch(t) {
  return t instanceof Function ? t() : t;
}
function lh(t) {
  return (t.flags & 128) === 128;
}
var mt = (function (t) {
  return (t[(t.Important = 1)] = 'Important'), (t[(t.DashCase = 2)] = 'DashCase'), t;
})(mt || {});
var uh = new Map(),
  Qy = 0;
function Xy() {
  return Qy++;
}
function Jy(t) {
  uh.set(t[Ho], t);
}
function e_(t) {
  uh.delete(t[Ho]);
}
var jd = '__ngContext__';
function en(t, e) {
  Nt(e) ? ((t[jd] = e[Ho]), Jy(e)) : (t[jd] = e);
}
var t_;
function qc(t, e) {
  return t_(t, e);
}
function Yc(t) {
  let e = t[ce];
  return Ke(e) ? e[ce] : e;
}
function dh(t) {
  return hh(t[jr]);
}
function fh(t) {
  return hh(t[Ye]);
}
function hh(t) {
  for (; t !== null && !Ke(t); ) t = t[Ye];
  return t;
}
function $n(t, e, r, n, i) {
  if (n != null) {
    let o,
      s = !1;
    Ke(n) ? (o = n) : Nt(n) && ((s = !0), (n = n[Dt]));
    let a = ct(n);
    t === 0 && r !== null
      ? i == null
        ? mh(e, r, a)
        : Oo(e, r, a, i || null, !0)
      : t === 1 && r !== null
        ? Oo(e, r, a, i || null, !0)
        : t === 2
          ? __(e, a, s)
          : t === 3 && e.destroyNode(a),
      o != null && C_(e, t, o, r, i);
  }
}
function n_(t, e) {
  return t.createText(e);
}
function r_(t, e, r) {
  t.setValue(e, r);
}
function ph(t, e, r) {
  return t.createElement(e, r);
}
function i_(t, e) {
  let r = e[de];
  Xr(t, e, r, 2, null, null), (e[Dt] = null), (e[Xe] = null);
}
function o_(t, e, r, n, i, o) {
  (n[Dt] = i), (n[Xe] = e), Xr(t, n, r, 1, i, o);
}
function s_(t, e) {
  Xr(t, e, e[de], 2, null, null);
}
function a_(t) {
  let e = t[jr];
  if (!e) return Ia(t[O], t);
  for (; e; ) {
    let r = null;
    if (Nt(e)) r = e[jr];
    else {
      let n = e[ve];
      n && (r = n);
    }
    if (!r) {
      for (; e && !e[Ye] && e !== t; ) Nt(e) && Ia(e[O], e), (e = e[ce]);
      e === null && (e = t), Nt(e) && Ia(e[O], e), (r = e && e[Ye]);
    }
    e = r;
  }
}
function c_(t, e, r, n) {
  let i = ve + n,
    o = r.length;
  n > 0 && (r[i - 1][Ye] = e), n < o - ve ? ((e[Ye] = r[i]), Qf(r, ve + n, e)) : (r.push(e), (e[Ye] = null)), (e[ce] = r);
  let s = e[qr];
  s !== null && r !== s && l_(s, e);
  let a = e[st];
  a !== null && a.insertView(t), xf(e), (e[x] |= 128);
}
function l_(t, e) {
  let r = t[Gn],
    i = e[ce][ce][Ze];
  e[Ze] !== i && (t[x] |= qn.HasTransplantedViews), r === null ? (t[Gn] = [e]) : r.push(e);
}
function gh(t, e) {
  let r = t[Gn],
    n = r.indexOf(e),
    i = e[ce];
  r.splice(n, 1);
}
function Br(t, e) {
  if (t.length <= ve) return;
  let r = ve + e,
    n = t[r];
  if (n) {
    let i = n[qr];
    i !== null && i !== t && gh(i, n), e > 0 && (t[r - 1][Ye] = n[Ye]);
    let o = xo(t, ve + e);
    i_(n[O], n);
    let s = o[st];
    s !== null && s.detachView(o[O]), (n[ce] = null), (n[Ye] = null), (n[x] &= -129);
  }
  return n;
}
function Zo(t, e) {
  if (!(e[x] & 256)) {
    let r = e[de];
    e[Zt] && qu(e[Zt]), r.destroyNode && Xr(t, e, r, 3, null, null), a_(e);
  }
}
function Ia(t, e) {
  if (!(e[x] & 256)) {
    (e[x] &= -129), (e[x] |= 256), d_(t, e), u_(t, e), e[O].type === 1 && e[de].destroy();
    let r = e[qr];
    if (r !== null && Ke(e[ce])) {
      r !== e[ce] && gh(r, e);
      let n = e[st];
      n !== null && n.detachView(t);
    }
    e_(e);
  }
}
function u_(t, e) {
  let r = t.cleanup,
    n = e[Lr];
  if (r !== null)
    for (let o = 0; o < r.length - 1; o += 2)
      if (typeof r[o] == 'string') {
        let s = r[o + 3];
        s >= 0 ? n[s]() : n[-s].unsubscribe(), (o += 2);
      } else {
        let s = n[r[o + 1]];
        r[o].call(s);
      }
  n !== null && (e[Lr] = null);
  let i = e[Rt];
  if (i !== null) {
    e[Rt] = null;
    for (let o = 0; o < i.length; o++) {
      let s = i[o];
      s();
    }
  }
}
function d_(t, e) {
  let r;
  if (t != null && (r = t.destroyHooks) != null)
    for (let n = 0; n < r.length; n += 2) {
      let i = e[r[n]];
      if (!(i instanceof Xt)) {
        let o = r[n + 1];
        if (Array.isArray(o))
          for (let s = 0; s < o.length; s += 2) {
            let a = i[o[s]],
              c = o[s + 1];
            it(4, a, c);
            try {
              c.call(a);
            } finally {
              it(5, a, c);
            }
          }
        else {
          it(4, i, o);
          try {
            o.call(i);
          } finally {
            it(5, i, o);
          }
        }
      }
    }
}
function f_(t, e, r) {
  return h_(t, e.parent, r);
}
function h_(t, e, r) {
  let n = e;
  for (; n !== null && n.type & 40; ) (e = n), (n = e.parent);
  if (n === null) return r[Dt];
  {
    let { componentOffset: i } = n;
    if (i > -1) {
      let { encapsulation: o } = t.data[n.directiveStart + i];
      if (o === at.None || o === at.Emulated) return null;
    }
    return je(n, r);
  }
}
function Oo(t, e, r, n, i) {
  t.insertBefore(e, r, n, i);
}
function mh(t, e, r) {
  t.appendChild(e, r);
}
function Bd(t, e, r, n, i) {
  n !== null ? Oo(t, e, r, n, i) : mh(t, e, r);
}
function p_(t, e, r, n) {
  t.removeChild(e, r, n);
}
function Zc(t, e) {
  return t.parentNode(e);
}
function g_(t, e) {
  return t.nextSibling(e);
}
function m_(t, e, r) {
  return y_(t, e, r);
}
function v_(t, e, r) {
  return t.type & 40 ? je(t, r) : null;
}
var y_ = v_,
  $d;
function Kc(t, e, r, n) {
  let i = f_(t, n, e),
    o = e[de],
    s = n.parent || e[Xe],
    a = m_(s, n, e);
  if (i != null)
    if (Array.isArray(r)) for (let c = 0; c < r.length; c++) Bd(o, i, r[c], a, !1);
    else Bd(o, i, r, a, !1);
  $d !== void 0 && $d(o, n, e, r, i);
}
function yo(t, e) {
  if (e !== null) {
    let r = e.type;
    if (r & 3) return je(e, t);
    if (r & 4) return Za(-1, t[e.index]);
    if (r & 8) {
      let n = e.child;
      if (n !== null) return yo(t, n);
      {
        let i = t[e.index];
        return Ke(i) ? Za(-1, i) : ct(i);
      }
    } else {
      if (r & 32) return qc(e, t)() || ct(t[e.index]);
      {
        let n = vh(t, e);
        if (n !== null) {
          if (Array.isArray(n)) return n[0];
          let i = Yc(t[Ze]);
          return yo(i, n);
        } else return yo(t, e.next);
      }
    }
  }
  return null;
}
function vh(t, e) {
  if (e !== null) {
    let n = t[Ze][Xe],
      i = e.projection;
    return n.projection[i];
  }
  return null;
}
function Za(t, e) {
  let r = ve + t + 1;
  if (r < e.length) {
    let n = e[r],
      i = n[O].firstChild;
    if (i !== null) return yo(n, i);
  }
  return e[Kt];
}
function __(t, e, r) {
  let n = Zc(t, e);
  n && p_(t, n, e, r);
}
function Qc(t, e, r, n, i, o, s) {
  for (; r != null; ) {
    let a = n[r.index],
      c = r.type;
    if ((s && e === 0 && (a && en(ct(a), n), (r.flags |= 2)), (r.flags & 32) !== 32))
      if (c & 8) Qc(t, e, r.child, n, i, o, !1), $n(e, t, i, a, o);
      else if (c & 32) {
        let l = qc(r, n),
          u;
        for (; (u = l()); ) $n(e, t, i, u, o);
        $n(e, t, i, a, o);
      } else c & 16 ? D_(t, e, n, r, i, o) : $n(e, t, i, a, o);
    r = s ? r.projectionNext : r.next;
  }
}
function Xr(t, e, r, n, i, o) {
  Qc(r, n, t.firstChild, e, i, o, !1);
}
function D_(t, e, r, n, i, o) {
  let s = r[Ze],
    c = s[Xe].projection[n.projection];
  if (Array.isArray(c))
    for (let l = 0; l < c.length; l++) {
      let u = c[l];
      $n(e, t, i, u, o);
    }
  else {
    let l = c,
      u = s[ce];
    lh(n) && (l.flags |= 128), Qc(t, e, l, u, i, o, !0);
  }
}
function C_(t, e, r, n, i) {
  let o = r[Kt],
    s = ct(r);
  o !== s && $n(e, t, n, o, i);
  for (let a = ve; a < r.length; a++) {
    let c = r[a];
    Xr(c[O], c, t, e, n, o);
  }
}
function w_(t, e, r, n, i) {
  if (e) i ? t.addClass(r, n) : t.removeClass(r, n);
  else {
    let o = n.indexOf('-') === -1 ? void 0 : mt.DashCase;
    i == null
      ? t.removeStyle(r, n, o)
      : (typeof i == 'string' && i.endsWith('!important') && ((i = i.slice(0, -10)), (o |= mt.Important)), t.setStyle(r, n, i, o));
  }
}
function b_(t, e, r) {
  t.setAttribute(e, 'style', r);
}
function yh(t, e, r) {
  r === '' ? t.removeAttribute(e, 'class') : t.setAttribute(e, 'class', r);
}
function _h(t, e, r) {
  let { mergedAttrs: n, classes: i, styles: o } = r;
  n !== null && ja(t, e, n), i !== null && yh(t, e, i), o !== null && b_(t, e, o);
}
var Ka = class {
  constructor(e) {
    this.changingThisBreaksApplicationSecurity = e;
  }
  toString() {
    return `SafeValue must use [property]=binding: ${this.changingThisBreaksApplicationSecurity} (see ${av})`;
  }
};
function Ko(t) {
  return t instanceof Ka ? t.changingThisBreaksApplicationSecurity : t;
}
var E_ = 'h',
  I_ = 'b';
var M_ = (t, e, r) => null;
function Xc(t, e, r = !1) {
  return M_(t, e, r);
}
var Qa = class {},
  Ro = class {};
function S_(t) {
  let e = Error(`No component factory found for ${Ce(t)}.`);
  return (e[x_] = t), e;
}
var x_ = 'ngComponent';
var Xa = class {
    resolveComponentFactory(e) {
      throw S_(e);
    }
  },
  Lt = (() => {
    let e = class e {};
    e.NULL = new Xa();
    let t = e;
    return t;
  })();
function A_() {
  return tr(Be(), z());
}
function tr(t, e) {
  return new te(je(t, e));
}
var te = (() => {
  let e = class e {
    constructor(n) {
      this.nativeElement = n;
    }
  };
  e.__NG_ELEMENT_ID__ = A_;
  let t = e;
  return t;
})();
function T_(t) {
  return t instanceof te ? t.nativeElement : t;
}
var $r = class {},
  nr = (() => {
    let e = class e {
      constructor() {
        this.destroyNode = null;
      }
    };
    e.__NG_ELEMENT_ID__ = () => O_();
    let t = e;
    return t;
  })();
function O_() {
  let t = z(),
    e = Be(),
    r = kt(e.index, t);
  return (Nt(r) ? r : t)[de];
}
var R_ = (() => {
    let e = class e {};
    e.ɵprov = y({ token: e, providedIn: 'root', factory: () => null });
    let t = e;
    return t;
  })(),
  tn = class {
    constructor(e) {
      (this.full = e), (this.major = e.split('.')[0]), (this.minor = e.split('.')[1]), (this.patch = e.split('.').slice(2).join('.'));
    }
  },
  N_ = new tn('17.0.4'),
  Ma = {};
function No(t, e, r, n, i = !1) {
  for (; r !== null; ) {
    let o = e[r.index];
    o !== null && n.push(ct(o)), Ke(o) && P_(o, n);
    let s = r.type;
    if (s & 8) No(t, e, r.child, n);
    else if (s & 32) {
      let a = qc(r, e),
        c;
      for (; (c = a()); ) n.push(c);
    } else if (s & 16) {
      let a = vh(e, r);
      if (Array.isArray(a)) n.push(...a);
      else {
        let c = Yc(e[Ze]);
        No(c[O], c, a, n, !0);
      }
    }
    r = i ? r.projectionNext : r.next;
  }
  return n;
}
function P_(t, e) {
  for (let r = ve; r < t.length; r++) {
    let n = t[r],
      i = n[O].firstChild;
    i !== null && No(n[O], n, i, e);
  }
  t[Kt] !== t[Dt] && e.push(t[Kt]);
}
var Dh = [];
function F_(t) {
  return t[Zt] ?? k_(t);
}
function k_(t) {
  let e = Dh.pop() ?? Object.create(V_);
  return (e.lView = t), e;
}
function L_(t) {
  t.lView[Zt] !== t && ((t.lView = null), Dh.push(t));
}
var V_ = G(m({}, zu), {
    consumerIsAlwaysLive: !0,
    consumerMarkedDirty: (t) => {
      Wo(t.lView);
    },
    consumerOnSignalRead() {
      this.lView[Zt] = this;
    },
  }),
  j_ = 'ngOriginalError';
function Sa(t) {
  return t[j_];
}
var vt = class {
  constructor() {
    this._console = console;
  }
  handleError(e) {
    let r = this._findOriginalError(e);
    this._console.error('ERROR', e), r && this._console.error('ORIGINAL ERROR', r);
  }
  _findOriginalError(e) {
    let r = e && Sa(e);
    for (; r && Sa(r); ) r = Sa(r);
    return r || null;
  }
};
var Ch = !1,
  B_ = new b('', { providedIn: 'root', factory: () => Ch });
var lt = {};
function A(t) {
  wh(Oe(), z(), Ct() + t, !1);
}
function wh(t, e, r, n) {
  if (!n)
    if ((e[x] & 3) === 3) {
      let o = t.preOrderCheckHooks;
      o !== null && po(e, o, r);
    } else {
      let o = t.preOrderHooks;
      o !== null && go(e, o, 0, r);
    }
  Qt(r);
}
function v(t, e = L.Default) {
  let r = z();
  if (r === null) return p(t, e);
  let n = Be();
  return Yf(n, r, De(t), e);
}
function $_(t, e) {
  let r = t.hostBindingOpCodes;
  if (r !== null)
    try {
      for (let n = 0; n < r.length; n++) {
        let i = r[n];
        if (i < 0) Qt(~i);
        else {
          let o = i,
            s = r[++n],
            a = r[++n];
          hy(s, o);
          let c = e[o];
          a(2, c);
        }
      }
    } finally {
      Qt(-1);
    }
}
function Qo(t, e, r, n, i, o, s, a, c, l, u) {
  let d = e.blueprint.slice();
  return (
    (d[Dt] = i),
    (d[x] = n | 4 | 128 | 8),
    (l !== null || (t && t[x] & 2048)) && (d[x] |= 2048),
    Sf(d),
    (d[ce] = d[Qn] = t),
    (d[pe] = r),
    (d[Vr] = s || (t && t[Vr])),
    (d[de] = a || (t && t[de])),
    (d[Wn] = c || (t && t[Wn]) || null),
    (d[Xe] = o),
    (d[Ho] = Xy()),
    (d[wo] = u),
    (d[Df] = l),
    (d[Ze] = e.type == 2 ? t[Ze] : d),
    d
  );
}
function Xo(t, e, r, n, i) {
  let o = t.data[e];
  if (o === null) (o = U_(t, e, r, n, i)), fy() && (o.flags |= 32);
  else if (o.type & 64) {
    (o.type = r), (o.value = n), (o.attrs = i);
    let s = ay();
    o.injectorIndex = s === null ? -1 : s.injectorIndex;
  }
  return Yr(o, !0), o;
}
function U_(t, e, r, n, i) {
  let o = Of(),
    s = Rf(),
    a = s ? o : o && o.parent,
    c = (t.data[e] = Y_(t, a, r, e, n, i));
  return (
    t.firstChild === null && (t.firstChild = c),
    o !== null && (s ? o.child == null && c.parent !== null && (o.child = c) : o.next === null && ((o.next = c), (c.prev = o))),
    c
  );
}
function bh(t, e, r, n) {
  if (r === 0) return -1;
  let i = e.length;
  for (let o = 0; o < r; o++) e.push(n), t.blueprint.push(n), t.data.push(null);
  return i;
}
function Eh(t, e, r, n, i) {
  let o = Ct(),
    s = n & 2;
  try {
    Qt(-1), s && e.length > Le && wh(t, e, Le, !1), it(s ? 2 : 0, i), r(n, i);
  } finally {
    Qt(o), it(s ? 3 : 1, i);
  }
}
function Ih(t, e, r) {
  if (wf(e)) {
    let n = he(null);
    try {
      let i = e.directiveStart,
        o = e.directiveEnd;
      for (let s = i; s < o; s++) {
        let a = t.data[s];
        a.contentQueries && a.contentQueries(1, r[s], s);
      }
    } finally {
      he(n);
    }
  }
}
function Mh(t, e, r) {
  Tf() && (tD(t, e, r, je(r, e)), (r.flags & 64) === 64 && Oh(t, e, r));
}
function Sh(t, e, r = je) {
  let n = e.localNames;
  if (n !== null) {
    let i = e.index + 1;
    for (let o = 0; o < n.length; o += 2) {
      let s = n[o + 1],
        a = s === -1 ? r(e, t) : t[s];
      t[i++] = a;
    }
  }
}
function xh(t) {
  let e = t.tView;
  return e === null || e.incompleteFirstPass
    ? (t.tView = Jc(1, null, t.template, t.decls, t.vars, t.directiveDefs, t.pipeDefs, t.viewQuery, t.schemas, t.consts, t.id))
    : e;
}
function Jc(t, e, r, n, i, o, s, a, c, l, u) {
  let d = Le + n,
    f = d + i,
    h = H_(d, f),
    g = typeof l == 'function' ? l() : l;
  return (h[O] = {
    type: t,
    blueprint: h,
    template: r,
    queries: null,
    viewQuery: a,
    declTNode: e,
    data: h.slice().fill(null, d),
    bindingStartIndex: d,
    expandoStartIndex: f,
    hostBindingOpCodes: null,
    firstCreatePass: !0,
    firstUpdatePass: !0,
    staticViewQueries: !1,
    staticContentQueries: !1,
    preOrderHooks: null,
    preOrderCheckHooks: null,
    contentHooks: null,
    contentCheckHooks: null,
    viewHooks: null,
    viewCheckHooks: null,
    destroyHooks: null,
    cleanup: null,
    contentQueries: null,
    components: null,
    directiveRegistry: typeof o == 'function' ? o() : o,
    pipeRegistry: typeof s == 'function' ? s() : s,
    firstChild: null,
    schemas: c,
    consts: g,
    incompleteFirstPass: !1,
    ssrId: u,
  });
}
function H_(t, e) {
  let r = [];
  for (let n = 0; n < e; n++) r.push(n < t ? null : lt);
  return r;
}
function z_(t, e, r, n) {
  let o = n.get(B_, Ch) || r === at.ShadowDom,
    s = t.selectRootElement(e, o);
  return W_(s), s;
}
function W_(t) {
  G_(t);
}
var G_ = (t) => null;
function q_(t, e, r, n) {
  let i = Fh(e);
  i.push(r), t.firstCreatePass && kh(t).push(n, i.length - 1);
}
function Y_(t, e, r, n, i, o) {
  let s = e ? e.injectorIndex : -1,
    a = 0;
  return (
    iy() && (a |= 128),
    {
      type: r,
      index: n,
      insertBeforeIndex: null,
      injectorIndex: s,
      directiveStart: -1,
      directiveEnd: -1,
      directiveStylingLast: -1,
      componentOffset: -1,
      propertyBindings: null,
      flags: a,
      providerIndexes: 0,
      value: i,
      attrs: o,
      mergedAttrs: null,
      localNames: null,
      initialInputs: void 0,
      inputs: null,
      outputs: null,
      tView: null,
      next: null,
      prev: null,
      projectionNext: null,
      child: null,
      parent: e,
      projection: null,
      styles: null,
      stylesWithoutHost: null,
      residualStyles: void 0,
      classes: null,
      classesWithoutHost: null,
      residualClasses: void 0,
      classBindings: 0,
      styleBindings: 0,
    }
  );
}
function Ud(t, e, r, n) {
  for (let i in t)
    if (t.hasOwnProperty(i)) {
      r = r === null ? {} : r;
      let o = t[i];
      n === null ? Hd(r, e, i, o) : n.hasOwnProperty(i) && Hd(r, e, n[i], o);
    }
  return r;
}
function Hd(t, e, r, n) {
  t.hasOwnProperty(r) ? t[r].push(e, n) : (t[r] = [e, n]);
}
function Z_(t, e, r) {
  let n = e.directiveStart,
    i = e.directiveEnd,
    o = t.data,
    s = e.attrs,
    a = [],
    c = null,
    l = null;
  for (let u = n; u < i; u++) {
    let d = o[u],
      f = r ? r.get(d) : null,
      h = f ? f.inputs : null,
      g = f ? f.outputs : null;
    (c = Ud(d.inputs, u, c, h)), (l = Ud(d.outputs, u, l, g));
    let w = c !== null && s !== null && !hf(e) ? fD(c, u, s) : null;
    a.push(w);
  }
  c !== null && (c.hasOwnProperty('class') && (e.flags |= 8), c.hasOwnProperty('style') && (e.flags |= 16)),
    (e.initialInputs = a),
    (e.inputs = c),
    (e.outputs = l);
}
function K_(t) {
  return t === 'class'
    ? 'className'
    : t === 'for'
      ? 'htmlFor'
      : t === 'formaction'
        ? 'formAction'
        : t === 'innerHtml'
          ? 'innerHTML'
          : t === 'readonly'
            ? 'readOnly'
            : t === 'tabindex'
              ? 'tabIndex'
              : t;
}
function Q_(t, e, r, n, i, o, s, a) {
  let c = je(e, r),
    l = e.inputs,
    u;
  !a && l != null && (u = l[n])
    ? (el(t, r, u, n, i), zo(e) && X_(r, e.index))
    : e.type & 3
      ? ((n = K_(n)), (i = s != null ? s(i, e.value || '', n) : i), o.setProperty(c, n, i))
      : e.type & 12;
}
function X_(t, e) {
  let r = kt(e, t);
  r[x] & 16 || (r[x] |= 64);
}
function Ah(t, e, r, n) {
  if (Tf()) {
    let i = n === null ? null : { '': -1 },
      o = rD(t, r),
      s,
      a;
    o === null ? (s = a = null) : ([s, a] = o), s !== null && Th(t, e, r, s, i, a), i && iD(r, n, i);
  }
  r.mergedAttrs = kr(r.mergedAttrs, r.attrs);
}
function Th(t, e, r, n, i, o) {
  for (let l = 0; l < n.length; l++) Ha(So(r, e), t, n[l].type);
  sD(r, t.data.length, n.length);
  for (let l = 0; l < n.length; l++) {
    let u = n[l];
    u.providersResolver && u.providersResolver(u);
  }
  let s = !1,
    a = !1,
    c = bh(t, e, n.length, null);
  for (let l = 0; l < n.length; l++) {
    let u = n[l];
    (r.mergedAttrs = kr(r.mergedAttrs, u.hostAttrs)),
      aD(t, r, e, c, u),
      oD(c, u, i),
      u.contentQueries !== null && (r.flags |= 4),
      (u.hostBindings !== null || u.hostAttrs !== null || u.hostVars !== 0) && (r.flags |= 64);
    let d = u.type.prototype;
    !s && (d.ngOnChanges || d.ngOnInit || d.ngDoCheck) && ((t.preOrderHooks ??= []).push(r.index), (s = !0)),
      !a && (d.ngOnChanges || d.ngDoCheck) && ((t.preOrderCheckHooks ??= []).push(r.index), (a = !0)),
      c++;
  }
  Z_(t, r, o);
}
function J_(t, e, r, n, i) {
  let o = i.hostBindings;
  if (o) {
    let s = t.hostBindingOpCodes;
    s === null && (s = t.hostBindingOpCodes = []);
    let a = ~e.index;
    eD(s) != a && s.push(a), s.push(r, n, o);
  }
}
function eD(t) {
  let e = t.length;
  for (; e > 0; ) {
    let r = t[--e];
    if (typeof r == 'number' && r < 0) return r;
  }
  return 0;
}
function tD(t, e, r, n) {
  let i = r.directiveStart,
    o = r.directiveEnd;
  zo(r) && cD(e, r, t.data[i + r.componentOffset]), t.firstCreatePass || So(r, e), en(n, e);
  let s = r.initialInputs;
  for (let a = i; a < o; a++) {
    let c = t.data[a],
      l = Jt(e, t, a, r);
    if ((en(l, e), s !== null && dD(e, a - i, l, c, r, s), Pt(c))) {
      let u = kt(r.index, e);
      u[pe] = Jt(e, t, a, r);
    }
  }
}
function Oh(t, e, r) {
  let n = r.directiveStart,
    i = r.directiveEnd,
    o = r.index,
    s = py();
  try {
    Qt(o);
    for (let a = n; a < i; a++) {
      let c = t.data[a],
        l = e[a];
      $a(a), (c.hostBindings !== null || c.hostVars !== 0 || c.hostAttrs !== null) && nD(c, l);
    }
  } finally {
    Qt(-1), $a(s);
  }
}
function nD(t, e) {
  t.hostBindings !== null && t.hostBindings(1, e);
}
function rD(t, e) {
  let r = t.directiveRegistry,
    n = null,
    i = null;
  if (r)
    for (let o = 0; o < r.length; o++) {
      let s = r[o];
      if (Pv(e, s.selectors, !1))
        if ((n || (n = []), Pt(s)))
          if (s.findHostDirectiveDefs !== null) {
            let a = [];
            (i = i || new Map()), s.findHostDirectiveDefs(s, a, i), n.unshift(...a, s);
            let c = a.length;
            Ja(t, e, c);
          } else n.unshift(s), Ja(t, e, 0);
        else (i = i || new Map()), s.findHostDirectiveDefs?.(s, n, i), n.push(s);
    }
  return n === null ? null : [n, i];
}
function Ja(t, e, r) {
  (e.componentOffset = r), (t.components ??= []).push(e.index);
}
function iD(t, e, r) {
  if (e) {
    let n = (t.localNames = []);
    for (let i = 0; i < e.length; i += 2) {
      let o = r[e[i + 1]];
      if (o == null) throw new M(-301, !1);
      n.push(e[i], o);
    }
  }
}
function oD(t, e, r) {
  if (r) {
    if (e.exportAs) for (let n = 0; n < e.exportAs.length; n++) r[e.exportAs[n]] = t;
    Pt(e) && (r[''] = t);
  }
}
function sD(t, e, r) {
  (t.flags |= 1), (t.directiveStart = e), (t.directiveEnd = e + r), (t.providerIndexes = e);
}
function aD(t, e, r, n, i) {
  t.data[n] = i;
  let o = i.factory || (i.factory = Yn(i.type, !0)),
    s = new Xt(o, Pt(i), v);
  (t.blueprint[n] = s), (r[n] = s), J_(t, e, n, bh(t, r, i.hostVars, lt), i);
}
function cD(t, e, r) {
  let n = je(e, t),
    i = xh(r),
    o = t[Vr].rendererFactory,
    s = 16;
  r.signals ? (s = 4096) : r.onPush && (s = 64);
  let a = Jo(t, Qo(t, i, null, s, n, e, null, o.createRenderer(n, r), null, null, null));
  t[e.index] = a;
}
function lD(t, e, r, n, i, o) {
  let s = je(t, e);
  uD(e[de], s, o, t.value, r, n, i);
}
function uD(t, e, r, n, i, o, s) {
  if (o == null) t.removeAttribute(e, i, r);
  else {
    let a = s == null ? Pr(o) : s(o, n || '', i);
    t.setAttribute(e, i, a, r);
  }
}
function dD(t, e, r, n, i, o) {
  let s = o[e];
  if (s !== null)
    for (let a = 0; a < s.length; ) {
      let c = s[a++],
        l = s[a++],
        u = s[a++];
      Rh(n, r, c, l, u);
    }
}
function Rh(t, e, r, n, i) {
  let o = he(null);
  try {
    let s = t.inputTransforms;
    s !== null && s.hasOwnProperty(n) && (i = s[n].call(e, i)), t.setInput !== null ? t.setInput(e, i, r, n) : (e[n] = i);
  } finally {
    he(o);
  }
}
function fD(t, e, r) {
  let n = null,
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (o === 0) {
      i += 4;
      continue;
    } else if (o === 5) {
      i += 2;
      continue;
    }
    if (typeof o == 'number') break;
    if (t.hasOwnProperty(o)) {
      n === null && (n = []);
      let s = t[o];
      for (let a = 0; a < s.length; a += 2)
        if (s[a] === e) {
          n.push(o, s[a + 1], r[i + 1]);
          break;
        }
    }
    i += 2;
  }
  return n;
}
function Nh(t, e, r, n) {
  return [t, !0, 0, e, null, n, null, r, null, null];
}
function Ph(t, e) {
  let r = t.contentQueries;
  if (r !== null) {
    let n = he(null);
    try {
      for (let i = 0; i < r.length; i += 2) {
        let o = r[i],
          s = r[i + 1];
        if (s !== -1) {
          let a = t.data[s];
          Pc(o), a.contentQueries(2, e[s], s);
        }
      }
    } finally {
      he(n);
    }
  }
}
function Jo(t, e) {
  return t[jr] ? (t[Rd][Ye] = e) : (t[jr] = e), (t[Rd] = e), e;
}
function ec(t, e, r) {
  Pc(0);
  let n = he(null);
  try {
    e(t, r);
  } finally {
    he(n);
  }
}
function Fh(t) {
  return t[Lr] || (t[Lr] = []);
}
function kh(t) {
  return t.cleanup || (t.cleanup = []);
}
function Lh(t, e) {
  let r = t[Wn],
    n = r ? r.get(vt, null) : null;
  n && n.handleError(e);
}
function el(t, e, r, n, i) {
  for (let o = 0; o < r.length; ) {
    let s = r[o++],
      a = r[o++],
      c = e[s],
      l = t.data[s];
    Rh(l, c, n, a, i);
  }
}
function Vh(t, e, r) {
  let n = Mf(e, t);
  r_(t[de], n, r);
}
var hD = 100;
function pD(t, e = !0) {
  let r = t[Vr],
    n = r.rendererFactory,
    i = r.afterRenderEventManager,
    o = !1;
  o || (n.begin?.(), i?.begin());
  try {
    let s = t[O],
      a = t[pe];
    jh(s, t, s.template, a), gD(t);
  } catch (s) {
    throw (e && Lh(t, s), s);
  } finally {
    o || (n.end?.(), r.inlineEffectRunner?.flush(), i?.end());
  }
}
function gD(t) {
  let e = 0;
  for (; t[x] & 9216 || t[Zt]?.dirty; ) {
    if (e === hD) throw new M(103, !1);
    e++, Uh(t, 1);
  }
}
function jh(t, e, r, n) {
  let i = e[x];
  if ((i & 256) === 256) return;
  let o = !1;
  !o && e[Vr].inlineEffectRunner?.flush(), Fc(e);
  let s = null,
    a = null;
  !o && mD(t) && ((a = F_(e)), (s = Wu(a)));
  try {
    Sf(e), dy(t.bindingStartIndex), r !== null && Eh(t, e, r, 2, n);
    let c = (i & 3) === 3;
    if (!o)
      if (c) {
        let d = t.preOrderCheckHooks;
        d !== null && po(e, d, null);
      } else {
        let d = t.preOrderHooks;
        d !== null && go(e, d, 0, null), Ca(e, 0);
      }
    if ((vD(e), Bh(e, 0), t.contentQueries !== null && Ph(t, e), !o))
      if (c) {
        let d = t.contentCheckHooks;
        d !== null && po(e, d);
      } else {
        let d = t.contentHooks;
        d !== null && go(e, d, 1), Ca(e, 1);
      }
    $_(t, e);
    let l = t.components;
    l !== null && Hh(e, l, 0);
    let u = t.viewQuery;
    if ((u !== null && ec(2, u, n), !o))
      if (c) {
        let d = t.viewCheckHooks;
        d !== null && po(e, d);
      } else {
        let d = t.viewHooks;
        d !== null && go(e, d, 2), Ca(e, 2);
      }
    if ((t.firstUpdatePass === !0 && (t.firstUpdatePass = !1), e[Da])) {
      for (let d of e[Da]) d();
      e[Da] = null;
    }
    o || (e[x] &= -73);
  } catch (c) {
    throw (Wo(e), c);
  } finally {
    a !== null && (Gu(a, s), L_(a)), kc();
  }
}
function mD(t) {
  return t.type !== 2;
}
function Bh(t, e) {
  for (let r = dh(t); r !== null; r = fh(r)) {
    r[x] &= ~qn.HasChildViewsToRefresh;
    for (let n = ve; n < r.length; n++) {
      let i = r[n];
      $h(i, e);
    }
  }
}
function vD(t) {
  for (let e = dh(t); e !== null; e = fh(e)) {
    if (!(e[x] & qn.HasTransplantedViews)) continue;
    let r = e[Gn];
    for (let n = 0; n < r.length; n++) {
      let i = r[n],
        o = i[ce];
      Xv(i);
    }
  }
}
function yD(t, e, r) {
  let n = kt(e, t);
  $h(n, r);
}
function $h(t, e) {
  Rc(t) && Uh(t, e);
}
function Uh(t, e) {
  let n = t[O],
    i = t[x],
    o = t[Zt],
    s = !!(e === 0 && i & 16);
  if (((s ||= !!(i & 64 && e === 0)), (s ||= !!(i & 1024)), (s ||= !!(o?.dirty && Xs(o))), o && (o.dirty = !1), (t[x] &= -9217), s))
    jh(n, t, n.template, t[pe]);
  else if (i & 8192) {
    Bh(t, 1);
    let a = n.components;
    a !== null && Hh(t, a, 1);
  }
}
function Hh(t, e, r) {
  for (let n = 0; n < e.length; n++) yD(t, e[n], r);
}
function tl(t) {
  for (; t; ) {
    t[x] |= 64;
    let e = Yc(t);
    if (Hv(t) && !e) return t;
    t = e;
  }
  return null;
}
var nn = class {
    get rootNodes() {
      let e = this._lView,
        r = e[O];
      return No(r, e, r.firstChild, []);
    }
    constructor(e, r, n = !0) {
      (this._lView = e),
        (this._cdRefInjectingView = r),
        (this.notifyErrorHandler = n),
        (this._appRef = null),
        (this._attachedToViewContainer = !1);
    }
    get context() {
      return this._lView[pe];
    }
    set context(e) {
      this._lView[pe] = e;
    }
    get destroyed() {
      return (this._lView[x] & 256) === 256;
    }
    destroy() {
      if (this._appRef) this._appRef.detachView(this);
      else if (this._attachedToViewContainer) {
        let e = this._lView[ce];
        if (Ke(e)) {
          let r = e[bo],
            n = r ? r.indexOf(this) : -1;
          n > -1 && (Br(e, n), xo(r, n));
        }
        this._attachedToViewContainer = !1;
      }
      Zo(this._lView[O], this._lView);
    }
    onDestroy(e) {
      Af(this._lView, e);
    }
    markForCheck() {
      tl(this._cdRefInjectingView || this._lView);
    }
    detach() {
      this._lView[x] &= -129;
    }
    reattach() {
      xf(this._lView), (this._lView[x] |= 128);
    }
    detectChanges() {
      pD(this._lView, this.notifyErrorHandler);
    }
    checkNoChanges() {}
    attachToViewContainerRef() {
      if (this._appRef) throw new M(902, !1);
      this._attachedToViewContainer = !0;
    }
    detachFromAppRef() {
      (this._appRef = null), s_(this._lView[O], this._lView);
    }
    attachToAppRef(e) {
      if (this._attachedToViewContainer) throw new M(902, !1);
      this._appRef = e;
    }
  },
  wt = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = _D;
    let t = e;
    return t;
  })();
function _D(t) {
  return DD(Be(), z(), (t & 16) === 16);
}
function DD(t, e, r) {
  if (zo(t) && !r) {
    let n = kt(t.index, e);
    return new nn(n, n);
  } else if (t.type & 47) {
    let n = e[Ze];
    return new nn(n, e);
  }
  return null;
}
var nl = (() => {
    let e = class e {};
    (e.__NG_ELEMENT_ID__ = CD), (e.__NG_ENV_ID__ = (n) => n);
    let t = e;
    return t;
  })(),
  tc = class extends nl {
    constructor(e) {
      super(), (this._lView = e);
    }
    onDestroy(e) {
      return Af(this._lView, e), () => ey(this._lView, e);
    }
  };
function CD() {
  return new tc(z());
}
var zd = new Set();
function es(t) {
  zd.has(t) || (zd.add(t), performance?.mark?.('mark_use_counter', { detail: { feature: t } }));
}
var nc = class extends $ {
  constructor(e = !1) {
    super(), (this.__isAsync = e);
  }
  emit(e) {
    super.next(e);
  }
  subscribe(e, r, n) {
    let i = e,
      o = r || (() => null),
      s = n;
    if (e && typeof e == 'object') {
      let c = e;
      (i = c.next?.bind(c)), (o = c.error?.bind(c)), (s = c.complete?.bind(c));
    }
    this.__isAsync && ((o = xa(o)), i && (i = xa(i)), s && (s = xa(s)));
    let a = super.subscribe({ next: i, error: o, complete: s });
    return e instanceof q && e.add(a), a;
  }
};
function xa(t) {
  return (e) => {
    setTimeout(t, void 0, e);
  };
}
var U = nc;
function Wd(...t) {}
function wD() {
  let t = typeof Nr.requestAnimationFrame == 'function',
    e = Nr[t ? 'requestAnimationFrame' : 'setTimeout'],
    r = Nr[t ? 'cancelAnimationFrame' : 'clearTimeout'];
  if (typeof Zone < 'u' && e && r) {
    let n = e[Zone.__symbol__('OriginalDelegate')];
    n && (e = n);
    let i = r[Zone.__symbol__('OriginalDelegate')];
    i && (r = i);
  }
  return { nativeRequestAnimationFrame: e, nativeCancelAnimationFrame: r };
}
var j = class t {
    constructor({ enableLongStackTrace: e = !1, shouldCoalesceEventChangeDetection: r = !1, shouldCoalesceRunChangeDetection: n = !1 }) {
      if (
        ((this.hasPendingMacrotasks = !1),
        (this.hasPendingMicrotasks = !1),
        (this.isStable = !0),
        (this.onUnstable = new U(!1)),
        (this.onMicrotaskEmpty = new U(!1)),
        (this.onStable = new U(!1)),
        (this.onError = new U(!1)),
        typeof Zone > 'u')
      )
        throw new M(908, !1);
      Zone.assertZonePatched();
      let i = this;
      (i._nesting = 0),
        (i._outer = i._inner = Zone.current),
        Zone.TaskTrackingZoneSpec && (i._inner = i._inner.fork(new Zone.TaskTrackingZoneSpec())),
        e && Zone.longStackTraceZoneSpec && (i._inner = i._inner.fork(Zone.longStackTraceZoneSpec)),
        (i.shouldCoalesceEventChangeDetection = !n && r),
        (i.shouldCoalesceRunChangeDetection = n),
        (i.lastRequestAnimationFrameId = -1),
        (i.nativeRequestAnimationFrame = wD().nativeRequestAnimationFrame),
        ID(i);
    }
    static isInAngularZone() {
      return typeof Zone < 'u' && Zone.current.get('isAngularZone') === !0;
    }
    static assertInAngularZone() {
      if (!t.isInAngularZone()) throw new M(909, !1);
    }
    static assertNotInAngularZone() {
      if (t.isInAngularZone()) throw new M(909, !1);
    }
    run(e, r, n) {
      return this._inner.run(e, r, n);
    }
    runTask(e, r, n, i) {
      let o = this._inner,
        s = o.scheduleEventTask('NgZoneEvent: ' + i, e, bD, Wd, Wd);
      try {
        return o.runTask(s, r, n);
      } finally {
        o.cancelTask(s);
      }
    }
    runGuarded(e, r, n) {
      return this._inner.runGuarded(e, r, n);
    }
    runOutsideAngular(e) {
      return this._outer.run(e);
    }
  },
  bD = {};
function rl(t) {
  if (t._nesting == 0 && !t.hasPendingMicrotasks && !t.isStable)
    try {
      t._nesting++, t.onMicrotaskEmpty.emit(null);
    } finally {
      if ((t._nesting--, !t.hasPendingMicrotasks))
        try {
          t.runOutsideAngular(() => t.onStable.emit(null));
        } finally {
          t.isStable = !0;
        }
    }
}
function ED(t) {
  t.isCheckStableRunning ||
    t.lastRequestAnimationFrameId !== -1 ||
    ((t.lastRequestAnimationFrameId = t.nativeRequestAnimationFrame.call(Nr, () => {
      t.fakeTopEventTask ||
        (t.fakeTopEventTask = Zone.root.scheduleEventTask(
          'fakeTopEventTask',
          () => {
            (t.lastRequestAnimationFrameId = -1), rc(t), (t.isCheckStableRunning = !0), rl(t), (t.isCheckStableRunning = !1);
          },
          void 0,
          () => {},
          () => {},
        )),
        t.fakeTopEventTask.invoke();
    })),
    rc(t));
}
function ID(t) {
  let e = () => {
    ED(t);
  };
  t._inner = t._inner.fork({
    name: 'angular',
    properties: { isAngularZone: !0 },
    onInvokeTask: (r, n, i, o, s, a) => {
      if (MD(a)) return r.invokeTask(i, o, s, a);
      try {
        return Gd(t), r.invokeTask(i, o, s, a);
      } finally {
        ((t.shouldCoalesceEventChangeDetection && o.type === 'eventTask') || t.shouldCoalesceRunChangeDetection) && e(), qd(t);
      }
    },
    onInvoke: (r, n, i, o, s, a, c) => {
      try {
        return Gd(t), r.invoke(i, o, s, a, c);
      } finally {
        t.shouldCoalesceRunChangeDetection && e(), qd(t);
      }
    },
    onHasTask: (r, n, i, o) => {
      r.hasTask(i, o),
        n === i &&
          (o.change == 'microTask'
            ? ((t._hasPendingMicrotasks = o.microTask), rc(t), rl(t))
            : o.change == 'macroTask' && (t.hasPendingMacrotasks = o.macroTask));
    },
    onHandleError: (r, n, i, o) => (r.handleError(i, o), t.runOutsideAngular(() => t.onError.emit(o)), !1),
  });
}
function rc(t) {
  t._hasPendingMicrotasks ||
  ((t.shouldCoalesceEventChangeDetection || t.shouldCoalesceRunChangeDetection) && t.lastRequestAnimationFrameId !== -1)
    ? (t.hasPendingMicrotasks = !0)
    : (t.hasPendingMicrotasks = !1);
}
function Gd(t) {
  t._nesting++, t.isStable && ((t.isStable = !1), t.onUnstable.emit(null));
}
function qd(t) {
  t._nesting--, rl(t);
}
var zh = new b('', { providedIn: 'root', factory: Wh });
function Wh() {
  let t = _(j),
    e = !0,
    r = new R((i) => {
      (e = t.isStable && !t.hasPendingMacrotasks && !t.hasPendingMicrotasks),
        t.runOutsideAngular(() => {
          i.next(e), i.complete();
        });
    }),
    n = new R((i) => {
      let o;
      t.runOutsideAngular(() => {
        o = t.onStable.subscribe(() => {
          j.assertNotInAngularZone(),
            queueMicrotask(() => {
              !e && !t.hasPendingMacrotasks && !t.hasPendingMicrotasks && ((e = !0), i.next(!0));
            });
        });
      });
      let s = t.onUnstable.subscribe(() => {
        j.assertInAngularZone(),
          e &&
            ((e = !1),
            t.runOutsideAngular(() => {
              i.next(!1);
            }));
      });
      return () => {
        o.unsubscribe(), s.unsubscribe();
      };
    });
  return Tr(r, n.pipe(lo()));
}
function MD(t) {
  return !Array.isArray(t) || t.length !== 1 ? !1 : t[0].data?.__ignore_ng_zone__ === !0;
}
var SD = (() => {
  let e = class e {
    constructor() {
      (this.renderDepth = 0), (this.handler = null), (this.internalCallbacks = []);
    }
    begin() {
      this.handler?.validateBegin(), this.renderDepth++;
    }
    end() {
      if ((this.renderDepth--, this.renderDepth === 0)) {
        for (let n of this.internalCallbacks) n();
        (this.internalCallbacks.length = 0), this.handler?.execute();
      }
    }
    ngOnDestroy() {
      this.handler?.destroy(), (this.handler = null), (this.internalCallbacks.length = 0);
    }
  };
  e.ɵprov = y({ token: e, providedIn: 'root', factory: () => new e() });
  let t = e;
  return t;
})();
function xD(t, e) {
  let r = kt(e, t),
    n = r[O];
  AD(n, r);
  let i = r[Dt];
  i !== null && r[wo] === null && (r[wo] = Xc(i, r[Wn])), il(n, r, r[pe]);
}
function AD(t, e) {
  for (let r = e.length; r < t.blueprint.length; r++) e.push(t.blueprint[r]);
}
function il(t, e, r) {
  Fc(e);
  try {
    let n = t.viewQuery;
    n !== null && ec(1, n, r);
    let i = t.template;
    i !== null && Eh(t, e, i, 1, r),
      t.firstCreatePass && (t.firstCreatePass = !1),
      t.staticContentQueries && Ph(t, e),
      t.staticViewQueries && ec(2, t.viewQuery, r);
    let o = t.components;
    o !== null && TD(e, o);
  } catch (n) {
    throw (t.firstCreatePass && ((t.incompleteFirstPass = !0), (t.firstCreatePass = !1)), n);
  } finally {
    (e[x] &= -5), kc();
  }
}
function TD(t, e) {
  for (let r = 0; r < e.length; r++) xD(t, e[r]);
}
function ic(t, e, r) {
  let n = r ? t.styles : null,
    i = r ? t.classes : null,
    o = 0;
  if (e !== null)
    for (let s = 0; s < e.length; s++) {
      let a = e[s];
      if (typeof a == 'number') o = a;
      else if (o == 1) i = ka(i, a);
      else if (o == 2) {
        let c = a,
          l = e[++s];
        n = ka(n, c + ': ' + l + ';');
      }
    }
  r ? (t.styles = n) : (t.stylesWithoutHost = n), r ? (t.classes = i) : (t.classesWithoutHost = i);
}
var Po = class extends Lt {
  constructor(e) {
    super(), (this.ngModule = e);
  }
  resolveComponentFactory(e) {
    let r = Yt(e);
    return new Ur(r, this.ngModule);
  }
};
function Yd(t) {
  let e = [];
  for (let r in t)
    if (t.hasOwnProperty(r)) {
      let n = t[r];
      e.push({ propName: n, templateName: r });
    }
  return e;
}
function OD(t) {
  let e = t.toLowerCase();
  return e === 'svg' ? qv : e === 'math' ? Yv : null;
}
var oc = class {
    constructor(e, r) {
      (this.injector = e), (this.parentInjector = r);
    }
    get(e, r, n) {
      n = $o(n);
      let i = this.injector.get(e, Ma, n);
      return i !== Ma || r === Ma ? i : this.parentInjector.get(e, r, n);
    }
  },
  Ur = class extends Ro {
    get inputs() {
      let e = this.componentDef,
        r = e.inputTransforms,
        n = Yd(e.inputs);
      if (r !== null) for (let i of n) r.hasOwnProperty(i.propName) && (i.transform = r[i.propName]);
      return n;
    }
    get outputs() {
      return Yd(this.componentDef.outputs);
    }
    constructor(e, r) {
      super(),
        (this.componentDef = e),
        (this.ngModule = r),
        (this.componentType = e.type),
        (this.selector = Vv(e.selectors)),
        (this.ngContentSelectors = e.ngContentSelectors ? e.ngContentSelectors : []),
        (this.isBoundToModule = !!r);
    }
    create(e, r, n, i) {
      i = i || this.ngModule;
      let o = i instanceof Ve ? i : i?.injector;
      o && this.componentDef.getStandaloneInjector !== null && (o = this.componentDef.getStandaloneInjector(o) || o);
      let s = o ? new oc(e, o) : e,
        a = s.get($r, null);
      if (a === null) throw new M(407, !1);
      let c = s.get(R_, null),
        l = s.get(SD, null),
        u = { rendererFactory: a, sanitizer: c, inlineEffectRunner: null, afterRenderEventManager: l },
        d = a.createRenderer(null, this.componentDef),
        f = this.componentDef.selectors[0][0] || 'div',
        h = n ? z_(d, n, this.componentDef.encapsulation, s) : ph(d, f, OD(f)),
        g = 4608,
        w = this.componentDef.onPush ? 576 : 528,
        H = this.componentDef.signals ? g : w,
        F = null;
      h !== null && (F = Xc(h, s, !0));
      let Ee = Jc(0, null, null, 1, 0, null, null, null, null, null, null),
        Ie = Qo(null, Ee, null, H, null, null, u, d, s, null, F);
      Fc(Ie);
      let ht, Dn;
      try {
        let ze = this.componentDef,
          Cn,
          Ks = null;
        ze.findHostDirectiveDefs ? ((Cn = []), (Ks = new Map()), ze.findHostDirectiveDefs(ze, Cn, Ks), Cn.push(ze)) : (Cn = [ze]);
        let Cm = RD(Ie, h),
          wm = ND(Cm, h, ze, Cn, Ie, u, d);
        (Dn = Oc(Ee, Le)),
          h && kD(d, ze, h, n),
          r !== void 0 && LD(Dn, this.ngContentSelectors, r),
          (ht = FD(wm, ze, Cn, Ks, Ie, [VD])),
          il(Ee, Ie, null);
      } finally {
        kc();
      }
      return new sc(this.componentType, ht, tr(Dn, Ie), Ie, Dn);
    }
  },
  sc = class extends Qa {
    constructor(e, r, n, i, o) {
      super(),
        (this.location = n),
        (this._rootLView = i),
        (this._tNode = o),
        (this.previousInputValues = null),
        (this.instance = r),
        (this.hostView = this.changeDetectorRef = new nn(i, void 0, !1)),
        (this.componentType = e);
    }
    setInput(e, r) {
      let n = this._tNode.inputs,
        i;
      if (n !== null && (i = n[e])) {
        if (((this.previousInputValues ??= new Map()), this.previousInputValues.has(e) && Object.is(this.previousInputValues.get(e), r)))
          return;
        let o = this._rootLView;
        el(o[O], o, i, e, r), this.previousInputValues.set(e, r);
        let s = kt(this._tNode.index, o);
        tl(s);
      }
    }
    get injector() {
      return new qt(this._tNode, this._rootLView);
    }
    destroy() {
      this.hostView.destroy();
    }
    onDestroy(e) {
      this.hostView.onDestroy(e);
    }
  };
function RD(t, e) {
  let r = t[O],
    n = Le;
  return (t[n] = e), Xo(r, n, 2, '#host', null);
}
function ND(t, e, r, n, i, o, s) {
  let a = i[O];
  PD(n, t, e, s);
  let c = null;
  e !== null && (c = Xc(e, i[Wn]));
  let l = o.rendererFactory.createRenderer(e, r),
    u = 16;
  r.signals ? (u = 4096) : r.onPush && (u = 64);
  let d = Qo(i, xh(r), null, u, i[t.index], t, o, l, null, null, c);
  return a.firstCreatePass && Ja(a, t, n.length - 1), Jo(i, d), (i[t.index] = d);
}
function PD(t, e, r, n) {
  for (let i of t) e.mergedAttrs = kr(e.mergedAttrs, i.hostAttrs);
  e.mergedAttrs !== null && (ic(e, e.mergedAttrs, !0), r !== null && _h(n, r, e));
}
function FD(t, e, r, n, i, o) {
  let s = Be(),
    a = i[O],
    c = je(s, i);
  Th(a, i, s, r, null, n);
  for (let u = 0; u < r.length; u++) {
    let d = s.directiveStart + u,
      f = Jt(i, a, d, s);
    en(f, i);
  }
  Oh(a, i, s), c && en(c, i);
  let l = Jt(i, a, s.directiveStart + s.componentOffset, s);
  if (((t[pe] = i[pe] = l), o !== null)) for (let u of o) u(l, e);
  return Ih(a, s, t), l;
}
function kD(t, e, r, n) {
  if (n) ja(t, r, ['ng-version', N_.full]);
  else {
    let { attrs: i, classes: o } = jv(e.selectors[0]);
    i && ja(t, r, i), o && o.length > 0 && yh(t, r, o.join(' '));
  }
}
function LD(t, e, r) {
  let n = (t.projection = []);
  for (let i = 0; i < e.length; i++) {
    let o = r[i];
    n.push(o != null ? Array.from(o) : null);
  }
}
function VD() {
  let t = Be();
  jc(z()[O], t);
}
function jD(t) {
  return Object.getPrototypeOf(t.prototype).constructor;
}
function Re(t) {
  let e = jD(t.type),
    r = !0,
    n = [t];
  for (; e; ) {
    let i;
    if (Pt(t)) i = e.ɵcmp || e.ɵdir;
    else {
      if (e.ɵcmp) throw new M(903, !1);
      i = e.ɵdir;
    }
    if (i) {
      if (r) {
        n.push(i);
        let s = t;
        (s.inputs = fo(t.inputs)),
          (s.inputTransforms = fo(t.inputTransforms)),
          (s.declaredInputs = fo(t.declaredInputs)),
          (s.outputs = fo(t.outputs));
        let a = i.hostBindings;
        a && HD(t, a);
        let c = i.viewQuery,
          l = i.contentQueries;
        if (
          (c && $D(t, c),
          l && UD(t, l),
          uo(t.inputs, i.inputs),
          uo(t.declaredInputs, i.declaredInputs),
          uo(t.outputs, i.outputs),
          i.inputTransforms !== null && (s.inputTransforms === null && (s.inputTransforms = {}), uo(s.inputTransforms, i.inputTransforms)),
          Pt(i) && i.data.animation)
        ) {
          let u = t.data;
          u.animation = (u.animation || []).concat(i.data.animation);
        }
      }
      let o = i.features;
      if (o)
        for (let s = 0; s < o.length; s++) {
          let a = o[s];
          a && a.ngInherit && a(t), a === Re && (r = !1);
        }
    }
    e = Object.getPrototypeOf(e);
  }
  BD(n);
}
function BD(t) {
  let e = 0,
    r = null;
  for (let n = t.length - 1; n >= 0; n--) {
    let i = t[n];
    (i.hostVars = e += i.hostVars), (i.hostAttrs = kr(i.hostAttrs, (r = kr(r, i.hostAttrs))));
  }
}
function fo(t) {
  return t === zn ? {} : t === Ae ? [] : t;
}
function $D(t, e) {
  let r = t.viewQuery;
  r
    ? (t.viewQuery = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.viewQuery = e);
}
function UD(t, e) {
  let r = t.contentQueries;
  r
    ? (t.contentQueries = (n, i, o) => {
        e(n, i, o), r(n, i, o);
      })
    : (t.contentQueries = e);
}
function HD(t, e) {
  let r = t.hostBindings;
  r
    ? (t.hostBindings = (n, i) => {
        e(n, i), r(n, i);
      })
    : (t.hostBindings = e);
}
function rr(t) {
  let e = t.inputConfig,
    r = {};
  for (let n in e)
    if (e.hasOwnProperty(n)) {
      let i = e[n];
      Array.isArray(i) && i[2] && (r[n] = i[2]);
    }
  t.inputTransforms = r;
}
function yt(t, e, r) {
  let n = t[e];
  return Object.is(n, r) ? !1 : ((t[e] = r), !0);
}
function zD(t, e, r, n) {
  let i = yt(t, e, r);
  return yt(t, e + 1, n) || i;
}
function ir(t, e, r, n) {
  let i = z(),
    o = Zr();
  if (yt(i, o, e)) {
    let s = Oe(),
      a = jf();
    lD(a, i, t, e, r, n);
  }
  return ir;
}
function WD(t, e, r, n) {
  return yt(t, Zr(), r) ? e + Pr(r) + n : lt;
}
function GD(t, e, r, n, i, o) {
  let s = uy(),
    a = zD(t, s, r, i);
  return Nc(2), a ? e + Pr(r) + n + Pr(i) + o : lt;
}
function ho(t, e) {
  return (t << 17) | (e << 2);
}
function rn(t) {
  return (t >> 17) & 32767;
}
function qD(t) {
  return (t & 2) == 2;
}
function YD(t, e) {
  return (t & 131071) | (e << 17);
}
function ac(t) {
  return t | 2;
}
function Kn(t) {
  return (t & 131068) >> 2;
}
function Aa(t, e) {
  return (t & -131069) | (e << 2);
}
function ZD(t) {
  return (t & 1) === 1;
}
function cc(t) {
  return t | 1;
}
function KD(t, e, r, n, i, o) {
  let s = o ? e.classBindings : e.styleBindings,
    a = rn(s),
    c = Kn(s);
  t[n] = r;
  let l = !1,
    u;
  if (Array.isArray(r)) {
    let d = r;
    (u = d[1]), (u === null || Kr(d, u) > 0) && (l = !0);
  } else u = r;
  if (i)
    if (c !== 0) {
      let f = rn(t[a + 1]);
      (t[n + 1] = ho(f, a)), f !== 0 && (t[f + 1] = Aa(t[f + 1], n)), (t[a + 1] = YD(t[a + 1], n));
    } else (t[n + 1] = ho(a, 0)), a !== 0 && (t[a + 1] = Aa(t[a + 1], n)), (a = n);
  else (t[n + 1] = ho(c, 0)), a === 0 ? (a = n) : (t[c + 1] = Aa(t[c + 1], n)), (c = n);
  l && (t[n + 1] = ac(t[n + 1])),
    Zd(t, u, n, !0, o),
    Zd(t, u, n, !1, o),
    QD(e, u, t, n, o),
    (s = ho(a, c)),
    o ? (e.classBindings = s) : (e.styleBindings = s);
}
function QD(t, e, r, n, i) {
  let o = i ? t.residualClasses : t.residualStyles;
  o != null && typeof e == 'string' && Kr(o, e) >= 0 && (r[n + 1] = cc(r[n + 1]));
}
function Zd(t, e, r, n, i) {
  let o = t[r + 1],
    s = e === null,
    a = n ? rn(o) : Kn(o),
    c = !1;
  for (; a !== 0 && (c === !1 || s); ) {
    let l = t[a],
      u = t[a + 1];
    XD(l, e) && ((c = !0), (t[a + 1] = n ? cc(u) : ac(u))), (a = n ? rn(u) : Kn(u));
  }
  c && (t[r + 1] = n ? ac(o) : cc(o));
}
function XD(t, e) {
  return t === null || e == null || (Array.isArray(t) ? t[1] : t) === e
    ? !0
    : Array.isArray(t) && typeof e == 'string'
      ? Kr(t, e) >= 0
      : !1;
}
var qe = { textEnd: 0, key: 0, keyEnd: 0, value: 0, valueEnd: 0 };
function JD(t) {
  return t.substring(qe.key, qe.keyEnd);
}
function eC(t) {
  return tC(t), Gh(t, qh(t, 0, qe.textEnd));
}
function Gh(t, e) {
  let r = qe.textEnd;
  return r === e ? -1 : ((e = qe.keyEnd = nC(t, (qe.key = e), r)), qh(t, e, r));
}
function tC(t) {
  (qe.key = 0), (qe.keyEnd = 0), (qe.value = 0), (qe.valueEnd = 0), (qe.textEnd = t.length);
}
function qh(t, e, r) {
  for (; e < r && t.charCodeAt(e) <= 32; ) e++;
  return e;
}
function nC(t, e, r) {
  for (; e < r && t.charCodeAt(e) > 32; ) e++;
  return e;
}
function J(t, e, r) {
  let n = z(),
    i = Zr();
  if (yt(n, i, e)) {
    let o = Oe(),
      s = jf();
    Q_(o, s, n, t, e, n[de], r, !1);
  }
  return J;
}
function lc(t, e, r, n, i) {
  let o = e.inputs,
    s = i ? 'class' : 'style';
  el(t, r, o[s], s, n);
}
function Jr(t, e, r) {
  return Zh(t, e, r, !1), Jr;
}
function Pe(t, e) {
  return Zh(t, e, null, !0), Pe;
}
function Yh(t) {
  iC(uC, rC, t, !0);
}
function rC(t, e) {
  for (let r = eC(e); r >= 0; r = Gh(e, r)) Uc(t, JD(e), !0);
}
function Zh(t, e, r, n) {
  let i = z(),
    o = Oe(),
    s = Nc(2);
  if ((o.firstUpdatePass && Qh(o, t, s, n), e !== lt && yt(i, s, e))) {
    let a = o.data[Ct()];
    Xh(o, a, i, i[de], t, (i[s + 1] = fC(e, r)), n, s);
  }
}
function iC(t, e, r, n) {
  let i = Oe(),
    o = Nc(2);
  i.firstUpdatePass && Qh(i, null, o, n);
  let s = z();
  if (r !== lt && yt(s, o, r)) {
    let a = i.data[Ct()];
    if (Jh(a, n) && !Kh(i, o)) {
      let c = n ? a.classesWithoutHost : a.stylesWithoutHost;
      c !== null && (r = ka(c, r || '')), lc(i, a, s, r, n);
    } else dC(i, a, s, s[de], s[o + 1], (s[o + 1] = lC(t, e, r)), n, o);
  }
}
function Kh(t, e) {
  return e >= t.expandoStartIndex;
}
function Qh(t, e, r, n) {
  let i = t.data;
  if (i[r + 1] === null) {
    let o = i[Ct()],
      s = Kh(t, r);
    Jh(o, n) && e === null && !s && (e = !1), (e = oC(i, o, e, n)), KD(i, o, e, r, s, n);
  }
}
function oC(t, e, r, n) {
  let i = gy(t),
    o = n ? e.residualClasses : e.residualStyles;
  if (i === null) (n ? e.classBindings : e.styleBindings) === 0 && ((r = Ta(null, t, e, r, n)), (r = Hr(r, e.attrs, n)), (o = null));
  else {
    let s = e.directiveStylingLast;
    if (s === -1 || t[s] !== i)
      if (((r = Ta(i, t, e, r, n)), o === null)) {
        let c = sC(t, e, n);
        c !== void 0 && Array.isArray(c) && ((c = Ta(null, t, e, c[1], n)), (c = Hr(c, e.attrs, n)), aC(t, e, n, c));
      } else o = cC(t, e, n);
  }
  return o !== void 0 && (n ? (e.residualClasses = o) : (e.residualStyles = o)), r;
}
function sC(t, e, r) {
  let n = r ? e.classBindings : e.styleBindings;
  if (Kn(n) !== 0) return t[rn(n)];
}
function aC(t, e, r, n) {
  let i = r ? e.classBindings : e.styleBindings;
  t[rn(i)] = n;
}
function cC(t, e, r) {
  let n,
    i = e.directiveEnd;
  for (let o = 1 + e.directiveStylingLast; o < i; o++) {
    let s = t[o].hostAttrs;
    n = Hr(n, s, r);
  }
  return Hr(n, e.attrs, r);
}
function Ta(t, e, r, n, i) {
  let o = null,
    s = r.directiveEnd,
    a = r.directiveStylingLast;
  for (a === -1 ? (a = r.directiveStart) : a++; a < s && ((o = e[a]), (n = Hr(n, o.hostAttrs, i)), o !== t); ) a++;
  return t !== null && (r.directiveStylingLast = a), n;
}
function Hr(t, e, r) {
  let n = r ? 1 : 2,
    i = -1;
  if (e !== null)
    for (let o = 0; o < e.length; o++) {
      let s = e[o];
      typeof s == 'number' ? (i = s) : i === n && (Array.isArray(t) || (t = t === void 0 ? [] : ['', t]), Uc(t, s, r ? !0 : e[++o]));
    }
  return t === void 0 ? null : t;
}
function lC(t, e, r) {
  if (r == null || r === '') return Ae;
  let n = [],
    i = Ko(r);
  if (Array.isArray(i)) for (let o = 0; o < i.length; o++) t(n, i[o], !0);
  else if (typeof i == 'object') for (let o in i) i.hasOwnProperty(o) && t(n, o, i[o]);
  else typeof i == 'string' && e(n, i);
  return n;
}
function uC(t, e, r) {
  let n = String(e);
  n !== '' && !n.includes(' ') && Uc(t, n, r);
}
function dC(t, e, r, n, i, o, s, a) {
  i === lt && (i = Ae);
  let c = 0,
    l = 0,
    u = 0 < i.length ? i[0] : null,
    d = 0 < o.length ? o[0] : null;
  for (; u !== null || d !== null; ) {
    let f = c < i.length ? i[c + 1] : void 0,
      h = l < o.length ? o[l + 1] : void 0,
      g = null,
      w;
    u === d
      ? ((c += 2), (l += 2), f !== h && ((g = d), (w = h)))
      : d === null || (u !== null && u < d)
        ? ((c += 2), (g = u))
        : ((l += 2), (g = d), (w = h)),
      g !== null && Xh(t, e, r, n, g, w, s, a),
      (u = c < i.length ? i[c] : null),
      (d = l < o.length ? o[l] : null);
  }
}
function Xh(t, e, r, n, i, o, s, a) {
  if (!(e.type & 3)) return;
  let c = t.data,
    l = c[a + 1],
    u = ZD(l) ? Kd(c, e, r, i, Kn(l), s) : void 0;
  if (!Fo(u)) {
    Fo(o) || (qD(l) && (o = Kd(c, null, r, i, a, s)));
    let d = Mf(Ct(), r);
    w_(n, s, d, i, o);
  }
}
function Kd(t, e, r, n, i, o) {
  let s = e === null,
    a;
  for (; i > 0; ) {
    let c = t[i],
      l = Array.isArray(c),
      u = l ? c[1] : c,
      d = u === null,
      f = r[i + 1];
    f === lt && (f = d ? Ae : void 0);
    let h = d ? ba(f, n) : u === n ? f : void 0;
    if ((l && !Fo(h) && (h = ba(c, n)), Fo(h) && ((a = h), s))) return a;
    let g = t[i + 1];
    i = s ? rn(g) : Kn(g);
  }
  if (e !== null) {
    let c = o ? e.residualClasses : e.residualStyles;
    c != null && (a = ba(c, n));
  }
  return a;
}
function Fo(t) {
  return t !== void 0;
}
function fC(t, e) {
  return t == null || t === '' || (typeof e == 'string' ? (t = t + e) : typeof t == 'object' && (t = Ce(Ko(t)))), t;
}
function Jh(t, e) {
  return (t.flags & (e ? 8 : 16)) !== 0;
}
var lR = new RegExp(`^(\\d+)*(${I_}|${E_})*(.*)`);
var hC = (t, e) => null;
function zr(t, e) {
  return hC(t, e);
}
var uc = class {
  destroy(e) {}
  updateValue(e, r) {}
  swap(e, r) {
    let n = Math.min(e, r),
      i = Math.max(e, r),
      o = this.detach(i);
    if (i - n > 1) {
      let s = this.detach(n);
      this.attach(n, o), this.attach(i, s);
    } else this.attach(n, o);
  }
  move(e, r) {
    this.attach(r, this.detach(e));
  }
};
function Oa(t, e, r, n, i) {
  return t === r && Object.is(e, n) ? 1 : Object.is(i(t, e), i(r, n)) ? -1 : 0;
}
function pC(t, e, r) {
  let n,
    i,
    o = 0,
    s = t.length - 1;
  if (Array.isArray(e)) {
    let a = e.length - 1;
    for (; o <= s && o <= a; ) {
      let c = t.at(o),
        l = e[o],
        u = Oa(o, c, o, l, r);
      if (u !== 0) {
        u < 0 && t.updateValue(o, l), o++;
        continue;
      }
      let d = t.at(s),
        f = e[a],
        h = Oa(s, d, a, f, r);
      if (h !== 0) {
        h < 0 && t.updateValue(s, f), s--, a--;
        continue;
      }
      let g = r(o, c),
        w = r(s, d),
        H = r(o, l);
      if (Object.is(H, w)) {
        let F = r(a, f);
        Object.is(F, g) ? (t.swap(o, s), t.updateValue(s, f), a--, s--) : t.move(s, o), t.updateValue(o, l), o++;
        continue;
      }
      if (((n ??= new ko()), (i ??= Xd(t, o, s, r)), dc(t, n, o, H))) t.updateValue(o, l), o++, s++;
      else if (i.has(H)) n.set(g, t.detach(o)), s--;
      else {
        let F = t.create(o, e[o]);
        t.attach(o, F), o++, s++;
      }
    }
    for (; o <= a; ) Qd(t, n, r, o, e[o]), o++;
  } else if (e != null) {
    let a = e[Symbol.iterator](),
      c = a.next();
    for (; !c.done && o <= s; ) {
      let l = t.at(o),
        u = c.value,
        d = Oa(o, l, o, u, r);
      if (d !== 0) d < 0 && t.updateValue(o, u), o++, (c = a.next());
      else {
        (n ??= new ko()), (i ??= Xd(t, o, s, r));
        let f = r(o, u);
        if (dc(t, n, o, f)) t.updateValue(o, u), o++, s++, (c = a.next());
        else if (!i.has(f)) t.attach(o, t.create(o, u)), o++, s++, (c = a.next());
        else {
          let h = r(o, l);
          n.set(h, t.detach(o)), s--;
        }
      }
    }
    for (; !c.done; ) Qd(t, n, r, t.length, c.value), (c = a.next());
  }
  for (; o <= s; ) t.destroy(t.detach(s--));
  n?.forEach((a) => {
    t.destroy(a);
  });
}
function dc(t, e, r, n) {
  return e !== void 0 && e.has(n) ? (t.attach(r, e.get(n)), e.delete(n), !0) : !1;
}
function Qd(t, e, r, n, i) {
  if (dc(t, e, n, r(n, i))) t.updateValue(n, i);
  else {
    let o = t.create(n, i);
    t.attach(n, o);
  }
}
function Xd(t, e, r, n) {
  let i = new Set();
  for (let o = e; o <= r; o++) i.add(n(o, t.at(o)));
  return i;
}
var ko = class {
  constructor() {
    this.map = new Map();
  }
  has(e) {
    let r = this.map.get(e);
    return r !== void 0 && r.length > 0;
  }
  delete(e) {
    let r = this.map.get(e);
    return r !== void 0 ? (r.shift(), !0) : !1;
  }
  get(e) {
    let r = this.map.get(e);
    return r !== void 0 && r.length > 0 ? r[0] : void 0;
  }
  set(e, r) {
    if (!this.map.has(e)) {
      this.map.set(e, [r]);
      return;
    }
    this.map.get(e)?.push(r);
  }
  forEach(e) {
    for (let [r, n] of this.map) for (let i of n) e(i, r);
  }
};
function ts(t, e, r, n) {
  let i = e.tView,
    s = t[x] & 4096 ? 4096 : 16,
    a = Qo(t, i, r, s, null, e, null, null, null, n?.injector ?? null, n?.dehydratedView ?? null),
    c = t[e.index];
  a[qr] = c;
  let l = t[st];
  return l !== null && (a[st] = l.createEmbeddedView(i)), il(i, a, r), a;
}
function ep(t, e) {
  let r = ve + e;
  if (r < t.length) return t[r];
}
function Wr(t, e) {
  return !e || lh(t);
}
function ns(t, e, r, n = !0) {
  let i = e[O];
  if ((c_(i, e, t, r), n)) {
    let o = Za(r, t),
      s = e[de],
      a = Zc(s, t[Kt]);
    a !== null && o_(i, t[Xe], s, e, a, o);
  }
}
function tp(t, e) {
  let r = Br(t, e);
  return r !== void 0 && Zo(r[O], r), r;
}
var Fe = (() => {
  let e = class e {};
  e.__NG_ELEMENT_ID__ = gC;
  let t = e;
  return t;
})();
function gC() {
  let t = Be();
  return rp(t, z());
}
var mC = Fe,
  np = class extends mC {
    constructor(e, r, n) {
      super(), (this._lContainer = e), (this._hostTNode = r), (this._hostLView = n);
    }
    get element() {
      return tr(this._hostTNode, this._hostLView);
    }
    get injector() {
      return new qt(this._hostTNode, this._hostLView);
    }
    get parentInjector() {
      let e = Bc(this._hostTNode, this._hostLView);
      if (Uf(e)) {
        let r = Mo(e, this._hostLView),
          n = Io(e),
          i = r[O].data[n + 8];
        return new qt(i, r);
      } else return new qt(null, this._hostLView);
    }
    clear() {
      for (; this.length > 0; ) this.remove(this.length - 1);
    }
    get(e) {
      let r = Jd(this._lContainer);
      return (r !== null && r[e]) || null;
    }
    get length() {
      return this._lContainer.length - ve;
    }
    createEmbeddedView(e, r, n) {
      let i, o;
      typeof n == 'number' ? (i = n) : n != null && ((i = n.index), (o = n.injector));
      let s = zr(this._lContainer, e.ssrId),
        a = e.createEmbeddedViewImpl(r || {}, o, s);
      return this.insertImpl(a, i, Wr(this._hostTNode, s)), a;
    }
    createComponent(e, r, n, i, o) {
      let s = e && !Ry(e),
        a;
      if (s) a = r;
      else {
        let g = r || {};
        (a = g.index), (n = g.injector), (i = g.projectableNodes), (o = g.environmentInjector || g.ngModuleRef);
      }
      let c = s ? e : new Ur(Yt(e)),
        l = n || this.parentInjector;
      if (!o && c.ngModule == null) {
        let w = (s ? l : this.parentInjector).get(Ve, null);
        w && (o = w);
      }
      let u = Yt(c.componentType ?? {}),
        d = zr(this._lContainer, u?.id ?? null),
        f = d?.firstChild ?? null,
        h = c.create(l, i, f, o);
      return this.insertImpl(h.hostView, a, Wr(this._hostTNode, d)), h;
    }
    insert(e, r) {
      return this.insertImpl(e, r, !0);
    }
    insertImpl(e, r, n) {
      let i = e._lView;
      if (Qv(i)) {
        let a = this.indexOf(e);
        if (a !== -1) this.detach(a);
        else {
          let c = i[ce],
            l = new np(c, c[Xe], c[ce]);
          l.detach(l.indexOf(e));
        }
      }
      let o = this._adjustIndex(r),
        s = this._lContainer;
      return ns(s, i, o, n), e.attachToViewContainerRef(), Qf(Ra(s), o, e), e;
    }
    move(e, r) {
      return this.insert(e, r);
    }
    indexOf(e) {
      let r = Jd(this._lContainer);
      return r !== null ? r.indexOf(e) : -1;
    }
    remove(e) {
      let r = this._adjustIndex(e, -1),
        n = Br(this._lContainer, r);
      n && (xo(Ra(this._lContainer), r), Zo(n[O], n));
    }
    detach(e) {
      let r = this._adjustIndex(e, -1),
        n = Br(this._lContainer, r);
      return n && xo(Ra(this._lContainer), r) != null ? new nn(n) : null;
    }
    _adjustIndex(e, r = 0) {
      return e ?? this.length + r;
    }
  };
function Jd(t) {
  return t[bo];
}
function Ra(t) {
  return t[bo] || (t[bo] = []);
}
function rp(t, e) {
  let r,
    n = e[t.index];
  return Ke(n) ? (r = n) : ((r = Nh(n, e, null, t)), (e[t.index] = r), Jo(e, r)), yC(r, e, t, n), new np(r, t, e);
}
function vC(t, e) {
  let r = t[de],
    n = r.createComment(''),
    i = je(e, t),
    o = Zc(r, i);
  return Oo(r, o, n, g_(r, i), !1), n;
}
var yC = CC,
  _C = (t, e, r) => !1;
function DC(t, e, r) {
  return _C(t, e, r);
}
function CC(t, e, r, n) {
  if (t[Kt]) return;
  let i;
  r.type & 8 ? (i = ct(n)) : (i = vC(e, r)), (t[Kt] = i);
}
function wC(t, e, r, n, i, o, s, a, c) {
  let l = e.consts,
    u = Xo(e, t, 4, s || null, Eo(l, a));
  Ah(e, r, u, Eo(l, c)), jc(e, u);
  let d = (u.tView = Jc(2, u, n, i, o, e.directiveRegistry, e.pipeRegistry, null, e.schemas, l, null));
  return e.queries !== null && (e.queries.template(e, u), (d.queries = e.queries.embeddedTView(u))), u;
}
function Te(t, e, r, n, i, o, s, a) {
  let c = z(),
    l = Oe(),
    u = t + Le,
    d = l.firstCreatePass ? wC(u, l, c, e, r, n, i, o, s) : l.data[u];
  Yr(d, !1);
  let f = bC(l, c, d, t);
  Lc() && Kc(l, c, f, d), en(f, c);
  let h = Nh(f, c, f, d);
  return (c[u] = h), Jo(c, h), DC(h, d, c), Tc(d) && Mh(l, c, d), s != null && Sh(c, d, a), Te;
}
var bC = EC;
function EC(t, e, r, n) {
  return Vc(!0), e[de].createComment('');
}
function Vt(t, e, r) {
  es('NgControlFlow');
  let n = z(),
    i = Zr(),
    o = gc(n, Le + t),
    s = 0;
  if (yt(n, i, e)) {
    let a = he(null);
    try {
      if ((tp(o, s), e !== -1)) {
        let c = mc(n[O], Le + e),
          l = zr(o, c.tView.ssrId),
          u = ts(n, c, r, { dehydratedView: l });
        ns(o, u, s, Wr(c, l));
      }
    } finally {
      he(a);
    }
  } else {
    let a = ep(o, s);
    a !== void 0 && (a[pe] = r);
  }
}
var fc = class {
  constructor(e, r, n) {
    (this.lContainer = e), (this.$implicit = r), (this.$index = n);
  }
  get $count() {
    return this.lContainer.length - ve;
  }
};
function bt(t, e) {
  return e;
}
var hc = class {
  constructor(e, r, n) {
    (this.hasEmptyBlock = e), (this.trackByFn = r), (this.liveCollection = n);
  }
};
function Et(t, e, r, n, i, o, s, a, c, l, u) {
  es('NgControlFlow');
  let d = c !== void 0,
    f = z(),
    h = a ? s.bind(f[Ze][pe]) : s,
    g = new hc(d, h);
  (f[Le + t] = g), Te(t + 1, e, r, n, i, o), d && Te(t + 2, c, l, u);
}
var pc = class extends uc {
  constructor(e, r, n) {
    super(), (this.lContainer = e), (this.hostLView = r), (this.templateTNode = n), (this.needsIndexUpdate = !1);
  }
  get length() {
    return this.lContainer.length - ve;
  }
  at(e) {
    return this.getLView(e)[pe].$implicit;
  }
  attach(e, r) {
    let n = r[wo];
    (this.needsIndexUpdate ||= e !== this.length), ns(this.lContainer, r, e, Wr(this.templateTNode, n));
  }
  detach(e) {
    return (this.needsIndexUpdate ||= e !== this.length - 1), IC(this.lContainer, e);
  }
  create(e, r) {
    let n = zr(this.lContainer, this.templateTNode.tView.ssrId);
    return ts(this.hostLView, this.templateTNode, new fc(this.lContainer, r, e), { dehydratedView: n });
  }
  destroy(e) {
    Zo(e[O], e);
  }
  updateValue(e, r) {
    this.getLView(e)[pe].$implicit = r;
  }
  reset() {
    this.needsIndexUpdate = !1;
  }
  updateIndexes() {
    if (this.needsIndexUpdate) for (let e = 0; e < this.length; e++) this.getLView(e)[pe].$index = e;
  }
  getLView(e) {
    return MC(this.lContainer, e);
  }
};
function It(t) {
  let e = he(null),
    r = Ct();
  try {
    let n = z(),
      i = n[O],
      o = n[r];
    if (o.liveCollection === void 0) {
      let a = r + 1,
        c = gc(n, a),
        l = mc(i, a);
      o.liveCollection = new pc(c, n, l);
    } else o.liveCollection.reset();
    let s = o.liveCollection;
    if ((pC(s, t, o.trackByFn), s.updateIndexes(), o.hasEmptyBlock)) {
      let a = Zr(),
        c = s.length === 0;
      if (yt(n, a, c)) {
        let l = r + 2,
          u = gc(n, l);
        if (c) {
          let d = mc(i, l),
            f = zr(u, d.tView.ssrId),
            h = ts(n, d, void 0, { dehydratedView: f });
          ns(u, h, 0, Wr(d, f));
        } else tp(u, 0);
      }
    }
  } finally {
    he(e);
  }
}
function gc(t, e) {
  return t[e];
}
function IC(t, e) {
  return Br(t, e);
}
function MC(t, e) {
  return ep(t, e);
}
function mc(t, e) {
  return Oc(t, e);
}
function SC(t, e, r, n, i, o) {
  let s = e.consts,
    a = Eo(s, i),
    c = Xo(e, t, 2, n, a);
  return (
    Ah(e, r, c, Eo(s, o)),
    c.attrs !== null && ic(c, c.attrs, !1),
    c.mergedAttrs !== null && ic(c, c.mergedAttrs, !0),
    e.queries !== null && e.queries.elementStart(e, c),
    c
  );
}
function C(t, e, r, n) {
  let i = z(),
    o = Oe(),
    s = Le + t,
    a = i[de],
    c = o.firstCreatePass ? SC(s, o, i, e, r, n) : o.data[s],
    l = xC(o, i, c, a, e, t);
  i[s] = l;
  let u = Tc(c);
  return (
    Yr(c, !0),
    _h(a, l, c),
    (c.flags & 32) !== 32 && Lc() && Kc(o, i, l, c),
    ty() === 0 && en(l, i),
    ny(),
    u && (Mh(o, i, c), Ih(o, c, i)),
    n !== null && Sh(i, c),
    C
  );
}
function D() {
  let t = Be();
  Rf() ? cy() : ((t = t.parent), Yr(t, !1));
  let e = t;
  oy(e) && sy(), ry();
  let r = Oe();
  return (
    r.firstCreatePass && (jc(r, t), wf(t) && r.queries.elementEnd(t)),
    e.classesWithoutHost != null && wy(e) && lc(r, e, z(), e.classesWithoutHost, !0),
    e.stylesWithoutHost != null && by(e) && lc(r, e, z(), e.stylesWithoutHost, !1),
    D
  );
}
function we(t, e, r, n) {
  return C(t, e, r, n), D(), we;
}
var xC = (t, e, r, n, i, o) => (Vc(!0), ph(n, i, yy()));
function or() {
  return z();
}
var Lo = 'en-US';
var AC = Lo;
function TC(t) {
  pv(t, 'Expected localeId to be defined'), typeof t == 'string' && (AC = t.toLowerCase().replace(/_/g, '-'));
}
function on(t) {
  return !!t && typeof t.then == 'function';
}
function ip(t) {
  return !!t && typeof t.subscribe == 'function';
}
function X(t, e, r, n) {
  let i = z(),
    o = Oe(),
    s = Be();
  return RC(o, i, i[de], s, t, e, n), X;
}
function OC(t, e, r, n) {
  let i = t.cleanup;
  if (i != null)
    for (let o = 0; o < i.length - 1; o += 2) {
      let s = i[o];
      if (s === r && i[o + 1] === n) {
        let a = e[Lr],
          c = i[o + 2];
        return a.length > c ? a[c] : null;
      }
      typeof s == 'string' && (o += 2);
    }
  return null;
}
function RC(t, e, r, n, i, o, s) {
  let a = Tc(n),
    l = t.firstCreatePass && kh(t),
    u = e[pe],
    d = Fh(e),
    f = !0;
  if (n.type & 3 || s) {
    let w = je(n, e),
      H = s ? s(w) : w,
      F = d.length,
      Ee = s ? (ht) => s(ct(ht[n.index])) : n.index,
      Ie = null;
    if ((!s && a && (Ie = OC(t, e, i, n.index)), Ie !== null)) {
      let ht = Ie.__ngLastListenerFn__ || Ie;
      (ht.__ngNextListenerFn__ = o), (Ie.__ngLastListenerFn__ = o), (f = !1);
    } else {
      o = tf(n, e, u, o, !1);
      let ht = r.listen(H, i, o);
      d.push(o, ht), l && l.push(i, Ee, F, F + 1);
    }
  } else o = tf(n, e, u, o, !1);
  let h = n.outputs,
    g;
  if (f && h !== null && (g = h[i])) {
    let w = g.length;
    if (w)
      for (let H = 0; H < w; H += 2) {
        let F = g[H],
          Ee = g[H + 1],
          Dn = e[F][Ee].subscribe(o),
          ze = d.length;
        d.push(o, Dn), l && l.push(i, n.index, ze, -(ze + 1));
      }
  }
}
function ef(t, e, r, n) {
  try {
    return it(6, e, r), r(n) !== !1;
  } catch (i) {
    return Lh(t, i), !1;
  } finally {
    it(7, e, r);
  }
}
function tf(t, e, r, n, i) {
  return function o(s) {
    if (s === Function) return n;
    let a = t.componentOffset > -1 ? kt(t.index, e) : e;
    tl(a);
    let c = ef(e, r, n, s),
      l = o.__ngNextListenerFn__;
    for (; l; ) (c = ef(e, r, l, s) && c), (l = l.__ngNextListenerFn__);
    return i && c === !1 && s.preventDefault(), c;
  };
}
function be(t = 1) {
  return vy(t);
}
function op(t) {
  let e = ly();
  return Zv(e, Le + t);
}
function S(t, e = '') {
  let r = z(),
    n = Oe(),
    i = t + Le,
    o = n.firstCreatePass ? Xo(n, i, 1, e, null) : n.data[i],
    s = NC(n, r, o, e, t);
  (r[i] = s), Lc() && Kc(n, r, s, o), Yr(o, !1);
}
var NC = (t, e, r, n, i) => (Vc(!0), n_(e[de], n));
function ei(t) {
  return Mt('', t, ''), ei;
}
function Mt(t, e, r) {
  let n = z(),
    i = WD(n, t, e, r);
  return i !== lt && Vh(n, Ct(), i), Mt;
}
function ti(t, e, r, n, i) {
  let o = z(),
    s = GD(o, t, e, r, n, i);
  return s !== lt && Vh(o, Ct(), s), ti;
}
function PC(t, e, r) {
  let n = Oe();
  if (n.firstCreatePass) {
    let i = Pt(t);
    vc(r, n.data, n.blueprint, i, !0), vc(e, n.data, n.blueprint, i, !1);
  }
}
function vc(t, e, r, n, i) {
  if (((t = De(t)), Array.isArray(t))) for (let o = 0; o < t.length; o++) vc(t[o], e, r, n, i);
  else {
    let o = Oe(),
      s = z(),
      a = Be(),
      c = Zn(t) ? t : De(t.provide),
      l = rh(t),
      u = a.providerIndexes & 1048575,
      d = a.directiveStart,
      f = a.providerIndexes >> 20;
    if (Zn(t) || !t.multi) {
      let h = new Xt(l, i, v),
        g = Pa(c, e, i ? u : u + f, d);
      g === -1
        ? (Ha(So(a, s), o, c),
          Na(o, t, e.length),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(h),
          s.push(h))
        : ((r[g] = h), (s[g] = h));
    } else {
      let h = Pa(c, e, u + f, d),
        g = Pa(c, e, u, u + f),
        w = h >= 0 && r[h],
        H = g >= 0 && r[g];
      if ((i && !H) || (!i && !w)) {
        Ha(So(a, s), o, c);
        let F = LC(i ? kC : FC, r.length, i, n, l);
        !i && H && (r[g].providerFactory = F),
          Na(o, t, e.length, 0),
          e.push(c),
          a.directiveStart++,
          a.directiveEnd++,
          i && (a.providerIndexes += 1048576),
          r.push(F),
          s.push(F);
      } else {
        let F = sp(r[i ? g : h], l, !i && n);
        Na(o, t, h > -1 ? h : g, F);
      }
      !i && n && H && r[g].componentProviders++;
    }
  }
}
function Na(t, e, r, n) {
  let i = Zn(e),
    o = Uy(e);
  if (i || o) {
    let c = (o ? De(e.useClass) : e).prototype.ngOnDestroy;
    if (c) {
      let l = t.destroyHooks || (t.destroyHooks = []);
      if (!i && e.multi) {
        let u = l.indexOf(r);
        u === -1 ? l.push(r, [n, c]) : l[u + 1].push(n, c);
      } else l.push(r, c);
    }
  }
}
function sp(t, e, r) {
  return r && t.componentProviders++, t.multi.push(e) - 1;
}
function Pa(t, e, r, n) {
  for (let i = r; i < n; i++) if (e[i] === t) return i;
  return -1;
}
function FC(t, e, r, n) {
  return yc(this.multi, []);
}
function kC(t, e, r, n) {
  let i = this.multi,
    o;
  if (this.providerFactory) {
    let s = this.providerFactory.componentProviders,
      a = Jt(r, r[O], this.providerFactory.index, n);
    (o = a.slice(0, s)), yc(i, o);
    for (let c = s; c < a.length; c++) o.push(a[c]);
  } else (o = []), yc(i, o);
  return o;
}
function yc(t, e) {
  for (let r = 0; r < t.length; r++) {
    let n = t[r];
    e.push(n());
  }
  return e;
}
function LC(t, e, r, n, i) {
  let o = new Xt(t, r, v);
  return (o.multi = []), (o.index = e), (o.componentProviders = 0), sp(o, i, n && !r), o;
}
function Ne(t, e = []) {
  return (r) => {
    r.providersResolver = (n, i) => PC(n, i ? i(t) : t, e);
  };
}
var Ft = class {},
  Gr = class {};
var _c = class extends Ft {
    constructor(e, r, n) {
      super(), (this._parent = r), (this._bootstrapComponents = []), (this.destroyCbs = []), (this.componentFactoryResolver = new Po(this));
      let i = vf(e);
      (this._bootstrapComponents = ch(i.bootstrap)),
        (this._r3Injector = oh(
          e,
          r,
          [{ provide: Ft, useValue: this }, { provide: Lt, useValue: this.componentFactoryResolver }, ...n],
          Ce(e),
          new Set(['environment']),
        )),
        this._r3Injector.resolveInjectorInitializers(),
        (this.instance = this._r3Injector.get(e));
    }
    get injector() {
      return this._r3Injector;
    }
    destroy() {
      let e = this._r3Injector;
      !e.destroyed && e.destroy(), this.destroyCbs.forEach((r) => r()), (this.destroyCbs = null);
    }
    onDestroy(e) {
      this.destroyCbs.push(e);
    }
  },
  Dc = class extends Gr {
    constructor(e) {
      super(), (this.moduleType = e);
    }
    create(e) {
      return new _c(this.moduleType, e, []);
    }
  };
var Vo = class extends Ft {
  constructor(e) {
    super(), (this.componentFactoryResolver = new Po(this)), (this.instance = null);
    let r = new To(
      [...e.providers, { provide: Ft, useValue: this }, { provide: Lt, useValue: this.componentFactoryResolver }],
      e.parent || zc(),
      e.debugName,
      new Set(['environment']),
    );
    (this.injector = r), e.runEnvironmentInitializers && r.resolveInjectorInitializers();
  }
  destroy() {
    this.injector.destroy();
  }
  onDestroy(e) {
    this.injector.onDestroy(e);
  }
};
function ol(t, e, r = null) {
  return new Vo({ providers: t, parent: e, debugName: r, runEnvironmentInitializers: !0 }).injector;
}
var VC = (() => {
  let e = class e {
    constructor(n) {
      (this._injector = n), (this.cachedInjectors = new Map());
    }
    getOrCreateStandaloneInjector(n) {
      if (!n.standalone) return null;
      if (!this.cachedInjectors.has(n)) {
        let i = eh(!1, n.type),
          o = i.length > 0 ? ol([i], this._injector, `Standalone[${n.type.name}]`) : null;
        this.cachedInjectors.set(n, o);
      }
      return this.cachedInjectors.get(n);
    }
    ngOnDestroy() {
      try {
        for (let n of this.cachedInjectors.values()) n !== null && n.destroy();
      } finally {
        this.cachedInjectors.clear();
      }
    }
  };
  e.ɵprov = y({ token: e, providedIn: 'environment', factory: () => new e(p(Ve)) });
  let t = e;
  return t;
})();
function Q(t) {
  es('NgStandalone'), (t.getStandaloneInjector = (e) => e.get(VC).getOrCreateStandaloneInjector(t));
}
function jC() {
  return this._results[Symbol.iterator]();
}
var jo = class t {
    get changes() {
      return this._changes || (this._changes = new U());
    }
    constructor(e = !1) {
      (this._emitDistinctChangesOnly = e),
        (this.dirty = !0),
        (this._results = []),
        (this._changesDetected = !1),
        (this._changes = null),
        (this.length = 0),
        (this.first = void 0),
        (this.last = void 0);
      let r = t.prototype;
      r[Symbol.iterator] || (r[Symbol.iterator] = jC);
    }
    get(e) {
      return this._results[e];
    }
    map(e) {
      return this._results.map(e);
    }
    filter(e) {
      return this._results.filter(e);
    }
    find(e) {
      return this._results.find(e);
    }
    reduce(e, r) {
      return this._results.reduce(e, r);
    }
    forEach(e) {
      this._results.forEach(e);
    }
    some(e) {
      return this._results.some(e);
    }
    toArray() {
      return this._results.slice();
    }
    toString() {
      return this._results.toString();
    }
    reset(e, r) {
      this.dirty = !1;
      let n = Py(e);
      (this._changesDetected = !Ny(this._results, n, r)) &&
        ((this._results = n), (this.length = n.length), (this.last = n[this.length - 1]), (this.first = n[0]));
    }
    notifyOnChanges() {
      this._changes && (this._changesDetected || !this._emitDistinctChangesOnly) && this._changes.emit(this);
    }
    setDirty() {
      this.dirty = !0;
    }
    destroy() {
      this.changes.complete(), this.changes.unsubscribe();
    }
  },
  Qe = (() => {
    let e = class e {};
    e.__NG_ELEMENT_ID__ = UC;
    let t = e;
    return t;
  })(),
  BC = Qe,
  $C = class extends BC {
    constructor(e, r, n) {
      super(), (this._declarationLView = e), (this._declarationTContainer = r), (this.elementRef = n);
    }
    get ssrId() {
      return this._declarationTContainer.tView?.ssrId || null;
    }
    createEmbeddedView(e, r) {
      return this.createEmbeddedViewImpl(e, r);
    }
    createEmbeddedViewImpl(e, r, n) {
      let i = ts(this._declarationLView, this._declarationTContainer, e, { injector: r, dehydratedView: n });
      return new nn(i);
    }
  };
function UC() {
  return sl(Be(), z());
}
function sl(t, e) {
  return t.type & 4 ? new $C(e, t, tr(t, e)) : null;
}
var Cc = class t {
    constructor(e) {
      (this.queryList = e), (this.matches = null);
    }
    clone() {
      return new t(this.queryList);
    }
    setDirty() {
      this.queryList.setDirty();
    }
  },
  wc = class t {
    constructor(e = []) {
      this.queries = e;
    }
    createEmbeddedView(e) {
      let r = e.queries;
      if (r !== null) {
        let n = e.contentQueries !== null ? e.contentQueries[0] : r.length,
          i = [];
        for (let o = 0; o < n; o++) {
          let s = r.getByIndex(o),
            a = this.queries[s.indexInDeclarationView];
          i.push(a.clone());
        }
        return new t(i);
      }
      return null;
    }
    insertView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    detachView(e) {
      this.dirtyQueriesWithMatches(e);
    }
    dirtyQueriesWithMatches(e) {
      for (let r = 0; r < this.queries.length; r++) cp(e, r).matches !== null && this.queries[r].setDirty();
    }
  },
  bc = class {
    constructor(e, r, n = null) {
      (this.predicate = e), (this.flags = r), (this.read = n);
    }
  },
  Ec = class t {
    constructor(e = []) {
      this.queries = e;
    }
    elementStart(e, r) {
      for (let n = 0; n < this.queries.length; n++) this.queries[n].elementStart(e, r);
    }
    elementEnd(e) {
      for (let r = 0; r < this.queries.length; r++) this.queries[r].elementEnd(e);
    }
    embeddedTView(e) {
      let r = null;
      for (let n = 0; n < this.length; n++) {
        let i = r !== null ? r.length : 0,
          o = this.getByIndex(n).embeddedTView(e, i);
        o && ((o.indexInDeclarationView = n), r !== null ? r.push(o) : (r = [o]));
      }
      return r !== null ? new t(r) : null;
    }
    template(e, r) {
      for (let n = 0; n < this.queries.length; n++) this.queries[n].template(e, r);
    }
    getByIndex(e) {
      return this.queries[e];
    }
    get length() {
      return this.queries.length;
    }
    track(e) {
      this.queries.push(e);
    }
  },
  Ic = class t {
    constructor(e, r = -1) {
      (this.metadata = e),
        (this.matches = null),
        (this.indexInDeclarationView = -1),
        (this.crossesNgTemplate = !1),
        (this._appliesToNextNode = !0),
        (this._declarationNodeIndex = r);
    }
    elementStart(e, r) {
      this.isApplyingToNode(r) && this.matchTNode(e, r);
    }
    elementEnd(e) {
      this._declarationNodeIndex === e.index && (this._appliesToNextNode = !1);
    }
    template(e, r) {
      this.elementStart(e, r);
    }
    embeddedTView(e, r) {
      return this.isApplyingToNode(e) ? ((this.crossesNgTemplate = !0), this.addMatch(-e.index, r), new t(this.metadata)) : null;
    }
    isApplyingToNode(e) {
      if (this._appliesToNextNode && (this.metadata.flags & 1) !== 1) {
        let r = this._declarationNodeIndex,
          n = e.parent;
        for (; n !== null && n.type & 8 && n.index !== r; ) n = n.parent;
        return r === (n !== null ? n.index : -1);
      }
      return this._appliesToNextNode;
    }
    matchTNode(e, r) {
      let n = this.metadata.predicate;
      if (Array.isArray(n))
        for (let i = 0; i < n.length; i++) {
          let o = n[i];
          this.matchTNodeWithReadOption(e, r, HC(r, o)), this.matchTNodeWithReadOption(e, r, mo(r, e, o, !1, !1));
        }
      else n === Qe ? r.type & 4 && this.matchTNodeWithReadOption(e, r, -1) : this.matchTNodeWithReadOption(e, r, mo(r, e, n, !1, !1));
    }
    matchTNodeWithReadOption(e, r, n) {
      if (n !== null) {
        let i = this.metadata.read;
        if (i !== null)
          if (i === te || i === Fe || (i === Qe && r.type & 4)) this.addMatch(r.index, -2);
          else {
            let o = mo(r, e, i, !1, !1);
            o !== null && this.addMatch(r.index, o);
          }
        else this.addMatch(r.index, n);
      }
    }
    addMatch(e, r) {
      this.matches === null ? (this.matches = [e, r]) : this.matches.push(e, r);
    }
  };
function HC(t, e) {
  let r = t.localNames;
  if (r !== null) {
    for (let n = 0; n < r.length; n += 2) if (r[n] === e) return r[n + 1];
  }
  return null;
}
function zC(t, e) {
  return t.type & 11 ? tr(t, e) : t.type & 4 ? sl(t, e) : null;
}
function WC(t, e, r, n) {
  return r === -1 ? zC(e, t) : r === -2 ? GC(t, e, n) : Jt(t, t[O], r, e);
}
function GC(t, e, r) {
  if (r === te) return tr(e, t);
  if (r === Qe) return sl(e, t);
  if (r === Fe) return rp(e, t);
}
function ap(t, e, r, n) {
  let i = e[st].queries[n];
  if (i.matches === null) {
    let o = t.data,
      s = r.matches,
      a = [];
    for (let c = 0; c < s.length; c += 2) {
      let l = s[c];
      if (l < 0) a.push(null);
      else {
        let u = o[l];
        a.push(WC(e, u, s[c + 1], r.metadata.read));
      }
    }
    i.matches = a;
  }
  return i.matches;
}
function Mc(t, e, r, n) {
  let i = t.queries.getByIndex(r),
    o = i.matches;
  if (o !== null) {
    let s = ap(t, e, i, r);
    for (let a = 0; a < o.length; a += 2) {
      let c = o[a];
      if (c > 0) n.push(s[a / 2]);
      else {
        let l = o[a + 1],
          u = e[-c];
        for (let d = ve; d < u.length; d++) {
          let f = u[d];
          f[qr] === f[ce] && Mc(f[O], f, l, n);
        }
        if (u[Gn] !== null) {
          let d = u[Gn];
          for (let f = 0; f < d.length; f++) {
            let h = d[f];
            Mc(h[O], h, l, n);
          }
        }
      }
    }
  }
  return n;
}
function sr(t) {
  let e = z(),
    r = Oe(),
    n = Nf();
  Pc(n + 1);
  let i = cp(r, n);
  if (t.dirty && Kv(e) === ((i.metadata.flags & 2) === 2)) {
    if (i.matches === null) t.reset([]);
    else {
      let o = i.crossesNgTemplate ? Mc(r, e, n, []) : ap(r, e, i, n);
      t.reset(o, T_), t.notifyOnChanges();
    }
    return !0;
  }
  return !1;
}
function ni(t, e, r) {
  let n = Oe();
  n.firstCreatePass && (ZC(n, new bc(t, e, r), -1), (e & 2) === 2 && (n.staticViewQueries = !0)), YC(n, z(), e);
}
function ar() {
  return qC(z(), Nf());
}
function qC(t, e) {
  return t[st].queries[e].queryList;
}
function YC(t, e, r) {
  let n = new jo((r & 4) === 4);
  q_(t, e, n, n.destroy), e[st] === null && (e[st] = new wc()), e[st].queries.push(new Cc(n));
}
function ZC(t, e, r) {
  t.queries === null && (t.queries = new Ec()), t.queries.track(new Ic(e, r));
}
function cp(t, e) {
  return t.queries.getByIndex(e);
}
var lp = new b('Application Initializer'),
  up = (() => {
    let e = class e {
      constructor() {
        (this.initialized = !1),
          (this.done = !1),
          (this.donePromise = new Promise((n, i) => {
            (this.resolve = n), (this.reject = i);
          })),
          (this.appInits = _(lp, { optional: !0 }) ?? []);
      }
      runInitializers() {
        if (this.initialized) return;
        let n = [];
        for (let o of this.appInits) {
          let s = o();
          if (on(s)) n.push(s);
          else if (ip(s)) {
            let a = new Promise((c, l) => {
              s.subscribe({ complete: c, error: l });
            });
            n.push(a);
          }
        }
        let i = () => {
          (this.done = !0), this.resolve();
        };
        Promise.all(n)
          .then(() => {
            i();
          })
          .catch((o) => {
            this.reject(o);
          }),
          n.length === 0 && i(),
          (this.initialized = !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  rs = (() => {
    let e = class e {
      log(n) {
        console.log(n);
      }
      warn(n) {
        console.warn(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'platform' }));
    let t = e;
    return t;
  })();
function KC() {
  return (typeof $localize < 'u' && $localize.locale) || Lo;
}
var al = new b('LocaleId', { providedIn: 'root', factory: () => _(al, L.Optional | L.SkipSelf) || KC() });
var cl = (() => {
    let e = class e {
      constructor() {
        (this.taskId = 0), (this.pendingTasks = new Set()), (this.hasPendingTasks = new le(!1));
      }
      add() {
        this.hasPendingTasks.next(!0);
        let n = this.taskId++;
        return this.pendingTasks.add(n), n;
      }
      remove(n) {
        this.pendingTasks.delete(n), this.pendingTasks.size === 0 && this.hasPendingTasks.next(!1);
      }
      ngOnDestroy() {
        this.pendingTasks.clear(), this.hasPendingTasks.next(!1);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Sc = class {
    constructor(e, r) {
      (this.ngModuleFactory = e), (this.componentFactories = r);
    }
  },
  ll = (() => {
    let e = class e {
      compileModuleSync(n) {
        return new Dc(n);
      }
      compileModuleAsync(n) {
        return Promise.resolve(this.compileModuleSync(n));
      }
      compileModuleAndAllComponentsSync(n) {
        let i = this.compileModuleSync(n),
          o = vf(n),
          s = ch(o.declarations).reduce((a, c) => {
            let l = Yt(c);
            return l && a.push(new Ur(l)), a;
          }, []);
        return new Sc(i, s);
      }
      compileModuleAndAllComponentsAsync(n) {
        return Promise.resolve(this.compileModuleAndAllComponentsSync(n));
      }
      clearCache() {}
      clearCacheFor(n) {}
      getModuleId(n) {}
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var dp = new b('');
var _o = null;
var fp = new b('PlatformDestroyListeners'),
  ul = new b('appBootstrapListener');
function QC() {
  Yu(() => {
    throw new M(600, !1);
  });
}
function XC(t) {
  return t.isBoundToModule;
}
function JC(t = []) {
  if (_o) return _o;
  let e = tw(t);
  return (_o = e), QC(), ew(e), e;
}
function ew(t) {
  t.get(Wc, null)?.forEach((r) => r());
}
function hp(t) {
  try {
    let { rootComponent: e, appProviders: r, platformProviders: n } = t,
      i = JC(n),
      o = [aw(), ...(r || [])],
      a = new Vo({ providers: o, parent: i, debugName: '', runEnvironmentInitializers: !1 }).injector,
      c = a.get(j);
    return c.run(() => {
      a.resolveInjectorInitializers();
      let l = a.get(vt, null),
        u;
      c.runOutsideAngular(() => {
        u = c.onError.subscribe({
          next: (h) => {
            l.handleError(h);
          },
        });
      });
      let d = () => a.destroy(),
        f = i.get(fp);
      return (
        f.add(d),
        a.onDestroy(() => {
          u.unsubscribe(), f.delete(d);
        }),
        rw(l, c, () => {
          let h = a.get(up);
          return (
            h.runInitializers(),
            h.donePromise.then(() => {
              let g = a.get(al, Lo);
              TC(g || Lo);
              let w = a.get(sn);
              return e !== void 0 && w.bootstrap(e), w;
            })
          );
        })
      );
    });
  } catch (e) {
    return Promise.reject(e);
  }
}
function tw(t = [], e) {
  return ge.create({
    name: e,
    providers: [{ provide: qo, useValue: 'platform' }, { provide: fp, useValue: new Set([() => (_o = null)]) }, ...t],
  });
}
function nw(t) {
  return {
    enableLongStackTrace: !1,
    shouldCoalesceEventChangeDetection: t?.eventCoalescing ?? !1,
    shouldCoalesceRunChangeDetection: t?.runCoalescing ?? !1,
  };
}
function rw(t, e, r) {
  try {
    let n = r();
    return on(n)
      ? n.catch((i) => {
          throw (e.runOutsideAngular(() => t.handleError(i)), i);
        })
      : n;
  } catch (n) {
    throw (e.runOutsideAngular(() => t.handleError(n)), n);
  }
}
var sn = (() => {
  let e = class e {
    constructor() {
      (this._bootstrapListeners = []),
        (this._runningTick = !1),
        (this._destroyed = !1),
        (this._destroyListeners = []),
        (this._views = []),
        (this.internalErrorHandler = _(pp)),
        (this.zoneIsStable = _(zh)),
        (this.componentTypes = []),
        (this.components = []),
        (this.isStable = _(cl).hasPendingTasks.pipe(
          xe((n) => (n ? I(!1) : this.zoneIsStable)),
          Fn(),
          lo(),
        )),
        (this._injector = _(Ve));
    }
    get destroyed() {
      return this._destroyed;
    }
    get injector() {
      return this._injector;
    }
    bootstrap(n, i) {
      let o = n instanceof Ro;
      if (!this._injector.get(up).done) {
        let g =
          'Cannot bootstrap as there are still asynchronous initializers running.' +
          (!o && mf(n) ? '' : ' Bootstrap components in the `ngDoBootstrap` method of the root module.');
        throw new M(405, !1);
      }
      let a;
      o ? (a = n) : (a = this._injector.get(Lt).resolveComponentFactory(n)), this.componentTypes.push(a.componentType);
      let c = XC(a) ? void 0 : this._injector.get(Ft),
        l = i || a.selector,
        u = a.create(ge.NULL, [], l, c),
        d = u.location.nativeElement,
        f = u.injector.get(dp, null);
      return (
        f?.registerApplication(d),
        u.onDestroy(() => {
          this.detachView(u.hostView), Fa(this.components, u), f?.unregisterApplication(d);
        }),
        this._loadComponent(u),
        u
      );
    }
    tick() {
      if (this._runningTick) throw new M(101, !1);
      try {
        this._runningTick = !0;
        for (let n of this._views) n.detectChanges();
      } catch (n) {
        this.internalErrorHandler(n);
      } finally {
        this._runningTick = !1;
      }
    }
    attachView(n) {
      let i = n;
      this._views.push(i), i.attachToAppRef(this);
    }
    detachView(n) {
      let i = n;
      Fa(this._views, i), i.detachFromAppRef();
    }
    _loadComponent(n) {
      this.attachView(n.hostView), this.tick(), this.components.push(n);
      let i = this._injector.get(ul, []);
      [...this._bootstrapListeners, ...i].forEach((o) => o(n));
    }
    ngOnDestroy() {
      if (!this._destroyed)
        try {
          this._destroyListeners.forEach((n) => n()), this._views.slice().forEach((n) => n.destroy());
        } finally {
          (this._destroyed = !0), (this._views = []), (this._bootstrapListeners = []), (this._destroyListeners = []);
        }
    }
    onDestroy(n) {
      return this._destroyListeners.push(n), () => Fa(this._destroyListeners, n);
    }
    destroy() {
      if (this._destroyed) throw new M(406, !1);
      let n = this._injector;
      n.destroy && !n.destroyed && n.destroy();
    }
    get viewCount() {
      return this._views.length;
    }
    warnIfDestroyed() {}
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function Fa(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
var pp = new b('', { providedIn: 'root', factory: () => _(vt).handleError.bind(void 0) });
function iw() {
  let t = _(j),
    e = _(vt);
  return (r) => t.runOutsideAngular(() => e.handleError(r));
}
var ow = (() => {
  let e = class e {
    constructor() {
      (this.zone = _(j)), (this.applicationRef = _(sn));
    }
    initialize() {
      this._onMicrotaskEmptySubscription ||
        (this._onMicrotaskEmptySubscription = this.zone.onMicrotaskEmpty.subscribe({
          next: () => {
            this.zone.run(() => {
              this.applicationRef.tick();
            });
          },
        }));
    }
    ngOnDestroy() {
      this._onMicrotaskEmptySubscription?.unsubscribe();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function sw(t) {
  return [
    { provide: j, useFactory: t },
    {
      provide: Qr,
      multi: !0,
      useFactory: () => {
        let e = _(ow, { optional: !0 });
        return () => e.initialize();
      },
    },
    { provide: pp, useFactory: iw },
    { provide: zh, useFactory: Wh },
  ];
}
function aw(t) {
  let e = sw(() => new j(nw(t)));
  return Go([[], e]);
}
function Ue(t) {
  return typeof t == 'boolean' ? t : t != null && t !== 'false';
}
var dl = null;
function St() {
  return dl;
}
function vp(t) {
  dl || (dl = t);
}
var is = class {},
  B = new b('DocumentToken'),
  yp = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error('Not implemented');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(dw))(), providedIn: 'platform' }));
    let t = e;
    return t;
  })();
var dw = (() => {
  let e = class e extends yp {
    constructor() {
      super(), (this._doc = _(B)), (this._location = window.location), (this._history = window.history);
    }
    getBaseHrefFromDOM() {
      return St().getBaseHref(this._doc);
    }
    onPopState(n) {
      let i = St().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('popstate', n, !1), () => i.removeEventListener('popstate', n);
    }
    onHashChange(n) {
      let i = St().getGlobalEventTarget(this._doc, 'window');
      return i.addEventListener('hashchange', n, !1), () => i.removeEventListener('hashchange', n);
    }
    get href() {
      return this._location.href;
    }
    get protocol() {
      return this._location.protocol;
    }
    get hostname() {
      return this._location.hostname;
    }
    get port() {
      return this._location.port;
    }
    get pathname() {
      return this._location.pathname;
    }
    get search() {
      return this._location.search;
    }
    get hash() {
      return this._location.hash;
    }
    set pathname(n) {
      this._location.pathname = n;
    }
    pushState(n, i, o) {
      this._history.pushState(n, i, o);
    }
    replaceState(n, i, o) {
      this._history.replaceState(n, i, o);
    }
    forward() {
      this._history.forward();
    }
    back() {
      this._history.back();
    }
    historyGo(n = 0) {
      this._history.go(n);
    }
    getState() {
      return this._history.state;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: () => (() => new e())(), providedIn: 'platform' }));
  let t = e;
  return t;
})();
function _p(t, e) {
  if (t.length == 0) return e;
  if (e.length == 0) return t;
  let r = 0;
  return t.endsWith('/') && r++, e.startsWith('/') && r++, r == 2 ? t + e.substring(1) : r == 1 ? t + e : t + '/' + e;
}
function gp(t) {
  let e = t.match(/#|\?|$/),
    r = (e && e.index) || t.length,
    n = r - (t[r - 1] === '/' ? 1 : 0);
  return t.slice(0, n) + t.slice(r);
}
function an(t) {
  return t && t[0] !== '?' ? '?' + t : t;
}
var ss = (() => {
    let e = class e {
      historyGo(n) {
        throw new Error('Not implemented');
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(Dp))(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  fw = new b('appBaseHref'),
  Dp = (() => {
    let e = class e extends ss {
      constructor(n, i) {
        super(),
          (this._platformLocation = n),
          (this._removeListenerFns = []),
          (this._baseHref = i ?? this._platformLocation.getBaseHrefFromDOM() ?? _(B).location?.origin ?? '');
      }
      ngOnDestroy() {
        for (; this._removeListenerFns.length; ) this._removeListenerFns.pop()();
      }
      onPopState(n) {
        this._removeListenerFns.push(this._platformLocation.onPopState(n), this._platformLocation.onHashChange(n));
      }
      getBaseHref() {
        return this._baseHref;
      }
      prepareExternalUrl(n) {
        return _p(this._baseHref, n);
      }
      path(n = !1) {
        let i = this._platformLocation.pathname + an(this._platformLocation.search),
          o = this._platformLocation.hash;
        return o && n ? `${i}${o}` : i;
      }
      pushState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + an(s));
        this._platformLocation.pushState(n, i, a);
      }
      replaceState(n, i, o, s) {
        let a = this.prepareExternalUrl(o + an(s));
        this._platformLocation.replaceState(n, i, a);
      }
      forward() {
        this._platformLocation.forward();
      }
      back() {
        this._platformLocation.back();
      }
      getState() {
        return this._platformLocation.getState();
      }
      historyGo(n = 0) {
        this._platformLocation.historyGo?.(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(yp), p(fw, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var cn = (() => {
  let e = class e {
    constructor(n) {
      (this._subject = new U()), (this._urlChangeListeners = []), (this._urlChangeSubscription = null), (this._locationStrategy = n);
      let i = this._locationStrategy.getBaseHref();
      (this._basePath = gw(gp(mp(i)))),
        this._locationStrategy.onPopState((o) => {
          this._subject.emit({ url: this.path(!0), pop: !0, state: o.state, type: o.type });
        });
    }
    ngOnDestroy() {
      this._urlChangeSubscription?.unsubscribe(), (this._urlChangeListeners = []);
    }
    path(n = !1) {
      return this.normalize(this._locationStrategy.path(n));
    }
    getState() {
      return this._locationStrategy.getState();
    }
    isCurrentPathEqualTo(n, i = '') {
      return this.path() == this.normalize(n + an(i));
    }
    normalize(n) {
      return e.stripTrailingSlash(pw(this._basePath, mp(n)));
    }
    prepareExternalUrl(n) {
      return n && n[0] !== '/' && (n = '/' + n), this._locationStrategy.prepareExternalUrl(n);
    }
    go(n, i = '', o = null) {
      this._locationStrategy.pushState(o, '', n, i), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + an(i)), o);
    }
    replaceState(n, i = '', o = null) {
      this._locationStrategy.replaceState(o, '', n, i), this._notifyUrlChangeListeners(this.prepareExternalUrl(n + an(i)), o);
    }
    forward() {
      this._locationStrategy.forward();
    }
    back() {
      this._locationStrategy.back();
    }
    historyGo(n = 0) {
      this._locationStrategy.historyGo?.(n);
    }
    onUrlChange(n) {
      return (
        this._urlChangeListeners.push(n),
        this._urlChangeSubscription ||
          (this._urlChangeSubscription = this.subscribe((i) => {
            this._notifyUrlChangeListeners(i.url, i.state);
          })),
        () => {
          let i = this._urlChangeListeners.indexOf(n);
          this._urlChangeListeners.splice(i, 1),
            this._urlChangeListeners.length === 0 && (this._urlChangeSubscription?.unsubscribe(), (this._urlChangeSubscription = null));
        }
      );
    }
    _notifyUrlChangeListeners(n = '', i) {
      this._urlChangeListeners.forEach((o) => o(n, i));
    }
    subscribe(n, i, o) {
      return this._subject.subscribe({ next: n, error: i, complete: o });
    }
  };
  (e.normalizeQueryParams = an),
    (e.joinWithSlash = _p),
    (e.stripTrailingSlash = gp),
    (e.ɵfac = function (i) {
      return new (i || e)(p(ss));
    }),
    (e.ɵprov = y({ token: e, factory: () => hw(), providedIn: 'root' }));
  let t = e;
  return t;
})();
function hw() {
  return new cn(p(ss));
}
function pw(t, e) {
  if (!t || !e.startsWith(t)) return e;
  let r = e.substring(t.length);
  return r === '' || ['/', ';', '?', '#'].includes(r[0]) ? r : e;
}
function mp(t) {
  return t.replace(/\/index.html$/, '');
}
function gw(t) {
  if (new RegExp('^(https?:)?//').test(t)) {
    let [, r] = t.split(/\/\/[^\/]+/);
    return r;
  }
  return t;
}
function Cp(t, e) {
  e = encodeURIComponent(e);
  for (let r of t.split(';')) {
    let n = r.indexOf('='),
      [i, o] = n == -1 ? [r, ''] : [r.slice(0, n), r.slice(n + 1)];
    if (i.trim() === e) return decodeURIComponent(o);
  }
  return null;
}
var fl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({}));
    let t = e;
    return t;
  })(),
  hl = 'browser',
  mw = 'server';
function cr(t) {
  return t === hl;
}
function pl(t) {
  return t === mw;
}
var os = class {};
var vl = class extends is {
    constructor() {
      super(...arguments), (this.supportsDOMEvents = !0);
    }
  },
  yl = class t extends vl {
    static makeCurrent() {
      vp(new t());
    }
    onAndCancel(e, r, n) {
      return (
        e.addEventListener(r, n),
        () => {
          e.removeEventListener(r, n);
        }
      );
    }
    dispatchEvent(e, r) {
      e.dispatchEvent(r);
    }
    remove(e) {
      e.parentNode && e.parentNode.removeChild(e);
    }
    createElement(e, r) {
      return (r = r || this.getDefaultDocument()), r.createElement(e);
    }
    createHtmlDocument() {
      return document.implementation.createHTMLDocument('fakeTitle');
    }
    getDefaultDocument() {
      return document;
    }
    isElementNode(e) {
      return e.nodeType === Node.ELEMENT_NODE;
    }
    isShadowRoot(e) {
      return e instanceof DocumentFragment;
    }
    getGlobalEventTarget(e, r) {
      return r === 'window' ? window : r === 'document' ? e : r === 'body' ? e.body : null;
    }
    getBaseHref(e) {
      let r = _w();
      return r == null ? null : Dw(r);
    }
    resetBaseElement() {
      ri = null;
    }
    getUserAgent() {
      return window.navigator.userAgent;
    }
    getCookie(e) {
      return Cp(document.cookie, e);
    }
  },
  ri = null;
function _w() {
  return (ri = ri || document.querySelector('base')), ri ? ri.getAttribute('href') : null;
}
var as;
function Dw(t) {
  (as = as || document.createElement('a')), as.setAttribute('href', t);
  let e = as.pathname;
  return e.charAt(0) === '/' ? e : `/${e}`;
}
var Cw = (() => {
    let e = class e {
      build() {
        return new XMLHttpRequest();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  _l = new b('EventManagerPlugins'),
  Ip = (() => {
    let e = class e {
      constructor(n, i) {
        (this._zone = i),
          (this._eventNameToPlugin = new Map()),
          n.forEach((o) => {
            o.manager = this;
          }),
          (this._plugins = n.slice().reverse());
      }
      addEventListener(n, i, o) {
        return this._findPluginFor(i).addEventListener(n, i, o);
      }
      getZone() {
        return this._zone;
      }
      _findPluginFor(n) {
        let i = this._eventNameToPlugin.get(n);
        if (i) return i;
        if (((i = this._plugins.find((s) => s.supports(n))), !i)) throw new M(5101, !1);
        return this._eventNameToPlugin.set(n, i), i;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(_l), p(j));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  cs = class {
    constructor(e) {
      this._doc = e;
    }
  },
  gl = 'ng-app-id',
  Mp = (() => {
    let e = class e {
      constructor(n, i, o, s = {}) {
        (this.doc = n),
          (this.appId = i),
          (this.nonce = o),
          (this.platformId = s),
          (this.styleRef = new Map()),
          (this.hostNodes = new Set()),
          (this.styleNodesInDOM = this.collectServerRenderedStyles()),
          (this.platformIsServer = pl(s)),
          this.resetHostNodes();
      }
      addStyles(n) {
        for (let i of n) this.changeUsageCount(i, 1) === 1 && this.onStyleAdded(i);
      }
      removeStyles(n) {
        for (let i of n) this.changeUsageCount(i, -1) <= 0 && this.onStyleRemoved(i);
      }
      ngOnDestroy() {
        let n = this.styleNodesInDOM;
        n && (n.forEach((i) => i.remove()), n.clear());
        for (let i of this.getAllStyles()) this.onStyleRemoved(i);
        this.resetHostNodes();
      }
      addHost(n) {
        this.hostNodes.add(n);
        for (let i of this.getAllStyles()) this.addStyleToHost(n, i);
      }
      removeHost(n) {
        this.hostNodes.delete(n);
      }
      getAllStyles() {
        return this.styleRef.keys();
      }
      onStyleAdded(n) {
        for (let i of this.hostNodes) this.addStyleToHost(i, n);
      }
      onStyleRemoved(n) {
        let i = this.styleRef;
        i.get(n)?.elements?.forEach((o) => o.remove()), i.delete(n);
      }
      collectServerRenderedStyles() {
        let n = this.doc.head?.querySelectorAll(`style[${gl}="${this.appId}"]`);
        if (n?.length) {
          let i = new Map();
          return (
            n.forEach((o) => {
              o.textContent != null && i.set(o.textContent, o);
            }),
            i
          );
        }
        return null;
      }
      changeUsageCount(n, i) {
        let o = this.styleRef;
        if (o.has(n)) {
          let s = o.get(n);
          return (s.usage += i), s.usage;
        }
        return o.set(n, { usage: i, elements: [] }), i;
      }
      getStyleElement(n, i) {
        let o = this.styleNodesInDOM,
          s = o?.get(i);
        if (s?.parentNode === n) return o.delete(i), s.removeAttribute(gl), s;
        {
          let a = this.doc.createElement('style');
          return (
            this.nonce && a.setAttribute('nonce', this.nonce),
            (a.textContent = i),
            this.platformIsServer && a.setAttribute(gl, this.appId),
            n.appendChild(a),
            a
          );
        }
      }
      addStyleToHost(n, i) {
        let o = this.getStyleElement(n, i),
          s = this.styleRef,
          a = s.get(i)?.elements;
        a ? a.push(o) : s.set(i, { elements: [o], usage: 1 });
      }
      resetHostNodes() {
        let n = this.hostNodes;
        n.clear(), n.add(this.doc.head);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B), p(Yo), p(Gc, 8), p($e));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ml = {
    svg: 'http://www.w3.org/2000/svg',
    xhtml: 'http://www.w3.org/1999/xhtml',
    xlink: 'http://www.w3.org/1999/xlink',
    xml: 'http://www.w3.org/XML/1998/namespace',
    xmlns: 'http://www.w3.org/2000/xmlns/',
    math: 'http://www.w3.org/1998/MathML/',
  },
  Cl = /%COMP%/g,
  Sp = '%COMP%',
  ww = `_nghost-${Sp}`,
  bw = `_ngcontent-${Sp}`,
  Ew = !0,
  Iw = new b('RemoveStylesOnCompDestroy', { providedIn: 'root', factory: () => Ew });
function Mw(t) {
  return bw.replace(Cl, t);
}
function Sw(t) {
  return ww.replace(Cl, t);
}
function xp(t, e) {
  return e.map((r) => r.replace(Cl, t));
}
var wp = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, l, u = null) {
        (this.eventManager = n),
          (this.sharedStylesHost = i),
          (this.appId = o),
          (this.removeStylesOnCompDestroy = s),
          (this.doc = a),
          (this.platformId = c),
          (this.ngZone = l),
          (this.nonce = u),
          (this.rendererByCompId = new Map()),
          (this.platformIsServer = pl(c)),
          (this.defaultRenderer = new ii(n, a, l, this.platformIsServer));
      }
      createRenderer(n, i) {
        if (!n || !i) return this.defaultRenderer;
        this.platformIsServer && i.encapsulation === at.ShadowDom && (i = G(m({}, i), { encapsulation: at.Emulated }));
        let o = this.getOrCreateRenderer(n, i);
        return o instanceof ls ? o.applyToHost(n) : o instanceof oi && o.applyStyles(), o;
      }
      getOrCreateRenderer(n, i) {
        let o = this.rendererByCompId,
          s = o.get(i.id);
        if (!s) {
          let a = this.doc,
            c = this.ngZone,
            l = this.eventManager,
            u = this.sharedStylesHost,
            d = this.removeStylesOnCompDestroy,
            f = this.platformIsServer;
          switch (i.encapsulation) {
            case at.Emulated:
              s = new ls(l, u, i, this.appId, d, a, c, f);
              break;
            case at.ShadowDom:
              return new Dl(l, u, n, i, a, c, this.nonce, f);
            default:
              s = new oi(l, u, i, d, a, c, f);
              break;
          }
          o.set(i.id, s);
        }
        return s;
      }
      ngOnDestroy() {
        this.rendererByCompId.clear();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(Ip), p(Mp), p(Yo), p(Iw), p(B), p($e), p(j), p(Gc));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  ii = class {
    constructor(e, r, n, i) {
      (this.eventManager = e),
        (this.doc = r),
        (this.ngZone = n),
        (this.platformIsServer = i),
        (this.data = Object.create(null)),
        (this.throwOnSyntheticProps = !0),
        (this.destroyNode = null);
    }
    destroy() {}
    createElement(e, r) {
      return r ? this.doc.createElementNS(ml[r] || r, e) : this.doc.createElement(e);
    }
    createComment(e) {
      return this.doc.createComment(e);
    }
    createText(e) {
      return this.doc.createTextNode(e);
    }
    appendChild(e, r) {
      (bp(e) ? e.content : e).appendChild(r);
    }
    insertBefore(e, r, n) {
      e && (bp(e) ? e.content : e).insertBefore(r, n);
    }
    removeChild(e, r) {
      e && e.removeChild(r);
    }
    selectRootElement(e, r) {
      let n = typeof e == 'string' ? this.doc.querySelector(e) : e;
      if (!n) throw new M(-5104, !1);
      return r || (n.textContent = ''), n;
    }
    parentNode(e) {
      return e.parentNode;
    }
    nextSibling(e) {
      return e.nextSibling;
    }
    setAttribute(e, r, n, i) {
      if (i) {
        r = i + ':' + r;
        let o = ml[i];
        o ? e.setAttributeNS(o, r, n) : e.setAttribute(r, n);
      } else e.setAttribute(r, n);
    }
    removeAttribute(e, r, n) {
      if (n) {
        let i = ml[n];
        i ? e.removeAttributeNS(i, r) : e.removeAttribute(`${n}:${r}`);
      } else e.removeAttribute(r);
    }
    addClass(e, r) {
      e.classList.add(r);
    }
    removeClass(e, r) {
      e.classList.remove(r);
    }
    setStyle(e, r, n, i) {
      i & (mt.DashCase | mt.Important) ? e.style.setProperty(r, n, i & mt.Important ? 'important' : '') : (e.style[r] = n);
    }
    removeStyle(e, r, n) {
      n & mt.DashCase ? e.style.removeProperty(r) : (e.style[r] = '');
    }
    setProperty(e, r, n) {
      e != null && (e[r] = n);
    }
    setValue(e, r) {
      e.nodeValue = r;
    }
    listen(e, r, n) {
      if (typeof e == 'string' && ((e = St().getGlobalEventTarget(this.doc, e)), !e))
        throw new Error(`Unsupported event target ${e} for event ${r}`);
      return this.eventManager.addEventListener(e, r, this.decoratePreventDefault(n));
    }
    decoratePreventDefault(e) {
      return (r) => {
        if (r === '__ngUnwrap__') return e;
        (this.platformIsServer ? this.ngZone.runGuarded(() => e(r)) : e(r)) === !1 && r.preventDefault();
      };
    }
  };
function bp(t) {
  return t.tagName === 'TEMPLATE' && t.content !== void 0;
}
var Dl = class extends ii {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, c),
        (this.sharedStylesHost = r),
        (this.hostEl = n),
        (this.shadowRoot = n.attachShadow({ mode: 'open' })),
        this.sharedStylesHost.addHost(this.shadowRoot);
      let l = xp(i.id, i.styles);
      for (let u of l) {
        let d = document.createElement('style');
        a && d.setAttribute('nonce', a), (d.textContent = u), this.shadowRoot.appendChild(d);
      }
    }
    nodeOrShadowRoot(e) {
      return e === this.hostEl ? this.shadowRoot : e;
    }
    appendChild(e, r) {
      return super.appendChild(this.nodeOrShadowRoot(e), r);
    }
    insertBefore(e, r, n) {
      return super.insertBefore(this.nodeOrShadowRoot(e), r, n);
    }
    removeChild(e, r) {
      return super.removeChild(this.nodeOrShadowRoot(e), r);
    }
    parentNode(e) {
      return this.nodeOrShadowRoot(super.parentNode(this.nodeOrShadowRoot(e)));
    }
    destroy() {
      this.sharedStylesHost.removeHost(this.shadowRoot);
    }
  },
  oi = class extends ii {
    constructor(e, r, n, i, o, s, a, c) {
      super(e, o, s, a), (this.sharedStylesHost = r), (this.removeStylesOnCompDestroy = i), (this.styles = c ? xp(c, n.styles) : n.styles);
    }
    applyStyles() {
      this.sharedStylesHost.addStyles(this.styles);
    }
    destroy() {
      this.removeStylesOnCompDestroy && this.sharedStylesHost.removeStyles(this.styles);
    }
  },
  ls = class extends oi {
    constructor(e, r, n, i, o, s, a, c) {
      let l = i + '-' + n.id;
      super(e, r, n, o, s, a, c, l), (this.contentAttr = Mw(l)), (this.hostAttr = Sw(l));
    }
    applyToHost(e) {
      this.applyStyles(), this.setAttribute(e, this.hostAttr, '');
    }
    createElement(e, r) {
      let n = super.createElement(e, r);
      return super.setAttribute(n, this.contentAttr, ''), n;
    }
  },
  xw = (() => {
    let e = class e extends cs {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return !0;
      }
      addEventListener(n, i, o) {
        return n.addEventListener(i, o, !1), () => this.removeEventListener(n, i, o);
      }
      removeEventListener(n, i, o) {
        return n.removeEventListener(i, o);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })(),
  Ep = ['alt', 'control', 'meta', 'shift'],
  Aw = {
    '\b': 'Backspace',
    '	': 'Tab',
    '\x7F': 'Delete',
    '\x1B': 'Escape',
    Del: 'Delete',
    Esc: 'Escape',
    Left: 'ArrowLeft',
    Right: 'ArrowRight',
    Up: 'ArrowUp',
    Down: 'ArrowDown',
    Menu: 'ContextMenu',
    Scroll: 'ScrollLock',
    Win: 'OS',
  },
  Tw = { alt: (t) => t.altKey, control: (t) => t.ctrlKey, meta: (t) => t.metaKey, shift: (t) => t.shiftKey },
  Ow = (() => {
    let e = class e extends cs {
      constructor(n) {
        super(n);
      }
      supports(n) {
        return e.parseEventName(n) != null;
      }
      addEventListener(n, i, o) {
        let s = e.parseEventName(i),
          a = e.eventCallback(s.fullKey, o, this.manager.getZone());
        return this.manager.getZone().runOutsideAngular(() => St().onAndCancel(n, s.domEventName, a));
      }
      static parseEventName(n) {
        let i = n.toLowerCase().split('.'),
          o = i.shift();
        if (i.length === 0 || !(o === 'keydown' || o === 'keyup')) return null;
        let s = e._normalizeKey(i.pop()),
          a = '',
          c = i.indexOf('code');
        if (
          (c > -1 && (i.splice(c, 1), (a = 'code.')),
          Ep.forEach((u) => {
            let d = i.indexOf(u);
            d > -1 && (i.splice(d, 1), (a += u + '.'));
          }),
          (a += s),
          i.length != 0 || s.length === 0)
        )
          return null;
        let l = {};
        return (l.domEventName = o), (l.fullKey = a), l;
      }
      static matchEventFullKeyCode(n, i) {
        let o = Aw[n.key] || n.key,
          s = '';
        return (
          i.indexOf('code.') > -1 && ((o = n.code), (s = 'code.')),
          o == null || !o
            ? !1
            : ((o = o.toLowerCase()),
              o === ' ' ? (o = 'space') : o === '.' && (o = 'dot'),
              Ep.forEach((a) => {
                if (a !== o) {
                  let c = Tw[a];
                  c(n) && (s += a + '.');
                }
              }),
              (s += o),
              s === i)
        );
      }
      static eventCallback(n, i, o) {
        return (s) => {
          e.matchEventFullKeyCode(s, n) && o.runGuarded(() => i(s));
        };
      }
      static _normalizeKey(n) {
        return n === 'esc' ? 'escape' : n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac }));
    let t = e;
    return t;
  })();
function Ap(t, e) {
  return hp(m({ rootComponent: t }, Rw(e)));
}
function Rw(t) {
  return { appProviders: [...Lw, ...(t?.providers ?? [])], platformProviders: kw };
}
function Nw() {
  yl.makeCurrent();
}
function Pw() {
  return new vt();
}
function Fw() {
  return sh(document), document;
}
var kw = [
  { provide: $e, useValue: hl },
  { provide: Wc, useValue: Nw, multi: !0 },
  { provide: B, useFactory: Fw, deps: [] },
];
var Lw = [
  { provide: qo, useValue: 'root' },
  { provide: vt, useFactory: Pw, deps: [] },
  { provide: _l, useClass: xw, multi: !0, deps: [B, j, $e] },
  { provide: _l, useClass: Ow, multi: !0, deps: [B] },
  wp,
  Mp,
  Ip,
  { provide: $r, useExisting: wp },
  { provide: os, useClass: Cw, deps: [] },
  [],
];
function Vw() {
  return new wl(p(B));
}
var wl = (() => {
  let e = class e {
    constructor(n) {
      this._doc = n;
    }
    getTitle() {
      return this._doc.title;
    }
    setTitle(n) {
      this._doc.title = n || '';
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p(B));
  }),
    (e.ɵprov = y({
      token: e,
      factory: function (i) {
        let o = null;
        return i ? (o = new i()) : (o = Vw()), o;
      },
      providedIn: 'root',
    }));
  let t = e;
  return t;
})();
var P = 'primary',
  Di = Symbol('RouteTitle'),
  Sl = class {
    constructor(e) {
      this.params = e || {};
    }
    has(e) {
      return Object.prototype.hasOwnProperty.call(this.params, e);
    }
    get(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r[0] : r;
      }
      return null;
    }
    getAll(e) {
      if (this.has(e)) {
        let r = this.params[e];
        return Array.isArray(r) ? r : [r];
      }
      return [];
    }
    get keys() {
      return Object.keys(this.params);
    }
  };
function hr(t) {
  return new Sl(t);
}
function Bw(t, e, r) {
  let n = r.path.split('/');
  if (n.length > t.length || (r.pathMatch === 'full' && (e.hasChildren() || n.length < t.length))) return null;
  let i = {};
  for (let o = 0; o < n.length; o++) {
    let s = n[o],
      a = t[o];
    if (s.startsWith(':')) i[s.substring(1)] = a;
    else if (s !== a.path) return null;
  }
  return { consumed: t.slice(0, n.length), posParams: i };
}
function $w(t, e) {
  if (t.length !== e.length) return !1;
  for (let r = 0; r < t.length; ++r) if (!ut(t[r], e[r])) return !1;
  return !0;
}
function ut(t, e) {
  let r = t ? xl(t) : void 0,
    n = e ? xl(e) : void 0;
  if (!r || !n || r.length != n.length) return !1;
  let i;
  for (let o = 0; o < r.length; o++) if (((i = r[o]), !kp(t[i], e[i]))) return !1;
  return !0;
}
function xl(t) {
  return [...Object.keys(t), ...Object.getOwnPropertySymbols(t)];
}
function kp(t, e) {
  if (Array.isArray(t) && Array.isArray(e)) {
    if (t.length !== e.length) return !1;
    let r = [...t].sort(),
      n = [...e].sort();
    return r.every((i, o) => n[o] === i);
  } else return t === e;
}
function Lp(t) {
  return t.length > 0 ? t[t.length - 1] : null;
}
function $t(t) {
  return ro(t) ? t : on(t) ? ne(Promise.resolve(t)) : I(t);
}
var Uw = { exact: jp, subset: Bp },
  Vp = { exact: Hw, subset: zw, ignored: () => !0 };
function Tp(t, e, r) {
  return (
    Uw[r.paths](t.root, e.root, r.matrixParams) &&
    Vp[r.queryParams](t.queryParams, e.queryParams) &&
    !(r.fragment === 'exact' && t.fragment !== e.fragment)
  );
}
function Hw(t, e) {
  return ut(t, e);
}
function jp(t, e, r) {
  if (!un(t.segments, e.segments) || !fs(t.segments, e.segments, r) || t.numberOfChildren !== e.numberOfChildren) return !1;
  for (let n in e.children) if (!t.children[n] || !jp(t.children[n], e.children[n], r)) return !1;
  return !0;
}
function zw(t, e) {
  return Object.keys(e).length <= Object.keys(t).length && Object.keys(e).every((r) => kp(t[r], e[r]));
}
function Bp(t, e, r) {
  return $p(t, e, e.segments, r);
}
function $p(t, e, r, n) {
  if (t.segments.length > r.length) {
    let i = t.segments.slice(0, r.length);
    return !(!un(i, r) || e.hasChildren() || !fs(i, r, n));
  } else if (t.segments.length === r.length) {
    if (!un(t.segments, r) || !fs(t.segments, r, n)) return !1;
    for (let i in e.children) if (!t.children[i] || !Bp(t.children[i], e.children[i], n)) return !1;
    return !0;
  } else {
    let i = r.slice(0, t.segments.length),
      o = r.slice(t.segments.length);
    return !un(t.segments, i) || !fs(t.segments, i, n) || !t.children[P] ? !1 : $p(t.children[P], e, o, n);
  }
}
function fs(t, e, r) {
  return e.every((n, i) => Vp[r](t[i].parameters, n.parameters));
}
var jt = class {
    constructor(e = new W([], {}), r = {}, n = null) {
      (this.root = e), (this.queryParams = r), (this.fragment = n);
    }
    get queryParamMap() {
      return this._queryParamMap || (this._queryParamMap = hr(this.queryParams)), this._queryParamMap;
    }
    toString() {
      return qw.serialize(this);
    }
  },
  W = class {
    constructor(e, r) {
      (this.segments = e), (this.children = r), (this.parent = null), Object.values(r).forEach((n) => (n.parent = this));
    }
    hasChildren() {
      return this.numberOfChildren > 0;
    }
    get numberOfChildren() {
      return Object.keys(this.children).length;
    }
    toString() {
      return hs(this);
    }
  },
  ln = class {
    constructor(e, r) {
      (this.path = e), (this.parameters = r);
    }
    get parameterMap() {
      return this._parameterMap || (this._parameterMap = hr(this.parameters)), this._parameterMap;
    }
    toString() {
      return Hp(this);
    }
  };
function Ww(t, e) {
  return un(t, e) && t.every((r, n) => ut(r.parameters, e[n].parameters));
}
function un(t, e) {
  return t.length !== e.length ? !1 : t.every((r, n) => r.path === e[n].path);
}
function Gw(t, e) {
  let r = [];
  return (
    Object.entries(t.children).forEach(([n, i]) => {
      n === P && (r = r.concat(e(i, n)));
    }),
    Object.entries(t.children).forEach(([n, i]) => {
      n !== P && (r = r.concat(e(i, n)));
    }),
    r
  );
}
var Jl = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => new gs())(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  gs = class {
    parse(e) {
      let r = new Tl(e);
      return new jt(r.parseRootSegment(), r.parseQueryParams(), r.parseFragment());
    }
    serialize(e) {
      let r = `/${si(e.root, !0)}`,
        n = Kw(e.queryParams),
        i = typeof e.fragment == 'string' ? `#${Yw(e.fragment)}` : '';
      return `${r}${n}${i}`;
    }
  },
  qw = new gs();
function hs(t) {
  return t.segments.map((e) => Hp(e)).join('/');
}
function si(t, e) {
  if (!t.hasChildren()) return hs(t);
  if (e) {
    let r = t.children[P] ? si(t.children[P], !1) : '',
      n = [];
    return (
      Object.entries(t.children).forEach(([i, o]) => {
        i !== P && n.push(`${i}:${si(o, !1)}`);
      }),
      n.length > 0 ? `${r}(${n.join('//')})` : r
    );
  } else {
    let r = Gw(t, (n, i) => (i === P ? [si(t.children[P], !1)] : [`${i}:${si(n, !1)}`]));
    return Object.keys(t.children).length === 1 && t.children[P] != null ? `${hs(t)}/${r[0]}` : `${hs(t)}/(${r.join('//')})`;
  }
}
function Up(t) {
  return encodeURIComponent(t).replace(/%40/g, '@').replace(/%3A/gi, ':').replace(/%24/g, '$').replace(/%2C/gi, ',');
}
function us(t) {
  return Up(t).replace(/%3B/gi, ';');
}
function Yw(t) {
  return encodeURI(t);
}
function Al(t) {
  return Up(t).replace(/\(/g, '%28').replace(/\)/g, '%29').replace(/%26/gi, '&');
}
function ps(t) {
  return decodeURIComponent(t);
}
function Op(t) {
  return ps(t.replace(/\+/g, '%20'));
}
function Hp(t) {
  return `${Al(t.path)}${Zw(t.parameters)}`;
}
function Zw(t) {
  return Object.keys(t)
    .map((e) => `;${Al(e)}=${Al(t[e])}`)
    .join('');
}
function Kw(t) {
  let e = Object.keys(t)
    .map((r) => {
      let n = t[r];
      return Array.isArray(n) ? n.map((i) => `${us(r)}=${us(i)}`).join('&') : `${us(r)}=${us(n)}`;
    })
    .filter((r) => !!r);
  return e.length ? `?${e.join('&')}` : '';
}
var Qw = /^[^\/()?;#]+/;
function bl(t) {
  let e = t.match(Qw);
  return e ? e[0] : '';
}
var Xw = /^[^\/()?;=#]+/;
function Jw(t) {
  let e = t.match(Xw);
  return e ? e[0] : '';
}
var eb = /^[^=?&#]+/;
function tb(t) {
  let e = t.match(eb);
  return e ? e[0] : '';
}
var nb = /^[^&#]+/;
function rb(t) {
  let e = t.match(nb);
  return e ? e[0] : '';
}
var Tl = class {
  constructor(e) {
    (this.url = e), (this.remaining = e);
  }
  parseRootSegment() {
    return (
      this.consumeOptional('/'),
      this.remaining === '' || this.peekStartsWith('?') || this.peekStartsWith('#') ? new W([], {}) : new W([], this.parseChildren())
    );
  }
  parseQueryParams() {
    let e = {};
    if (this.consumeOptional('?'))
      do this.parseQueryParam(e);
      while (this.consumeOptional('&'));
    return e;
  }
  parseFragment() {
    return this.consumeOptional('#') ? decodeURIComponent(this.remaining) : null;
  }
  parseChildren() {
    if (this.remaining === '') return {};
    this.consumeOptional('/');
    let e = [];
    for (
      this.peekStartsWith('(') || e.push(this.parseSegment());
      this.peekStartsWith('/') && !this.peekStartsWith('//') && !this.peekStartsWith('/(');

    )
      this.capture('/'), e.push(this.parseSegment());
    let r = {};
    this.peekStartsWith('/(') && (this.capture('/'), (r = this.parseParens(!0)));
    let n = {};
    return this.peekStartsWith('(') && (n = this.parseParens(!1)), (e.length > 0 || Object.keys(r).length > 0) && (n[P] = new W(e, r)), n;
  }
  parseSegment() {
    let e = bl(this.remaining);
    if (e === '' && this.peekStartsWith(';')) throw new M(4009, !1);
    return this.capture(e), new ln(ps(e), this.parseMatrixParams());
  }
  parseMatrixParams() {
    let e = {};
    for (; this.consumeOptional(';'); ) this.parseParam(e);
    return e;
  }
  parseParam(e) {
    let r = Jw(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = '';
    if (this.consumeOptional('=')) {
      let i = bl(this.remaining);
      i && ((n = i), this.capture(n));
    }
    e[ps(r)] = ps(n);
  }
  parseQueryParam(e) {
    let r = tb(this.remaining);
    if (!r) return;
    this.capture(r);
    let n = '';
    if (this.consumeOptional('=')) {
      let s = rb(this.remaining);
      s && ((n = s), this.capture(n));
    }
    let i = Op(r),
      o = Op(n);
    if (e.hasOwnProperty(i)) {
      let s = e[i];
      Array.isArray(s) || ((s = [s]), (e[i] = s)), s.push(o);
    } else e[i] = o;
  }
  parseParens(e) {
    let r = {};
    for (this.capture('('); !this.consumeOptional(')') && this.remaining.length > 0; ) {
      let n = bl(this.remaining),
        i = this.remaining[n.length];
      if (i !== '/' && i !== ')' && i !== ';') throw new M(4010, !1);
      let o;
      n.indexOf(':') > -1 ? ((o = n.slice(0, n.indexOf(':'))), this.capture(o), this.capture(':')) : e && (o = P);
      let s = this.parseChildren();
      (r[o] = Object.keys(s).length === 1 ? s[P] : new W([], s)), this.consumeOptional('//');
    }
    return r;
  }
  peekStartsWith(e) {
    return this.remaining.startsWith(e);
  }
  consumeOptional(e) {
    return this.peekStartsWith(e) ? ((this.remaining = this.remaining.substring(e.length)), !0) : !1;
  }
  capture(e) {
    if (!this.consumeOptional(e)) throw new M(4011, !1);
  }
};
function zp(t) {
  return t.segments.length > 0 ? new W([], { [P]: t }) : t;
}
function Wp(t) {
  let e = {};
  for (let n of Object.keys(t.children)) {
    let i = t.children[n],
      o = Wp(i);
    if (n === P && o.segments.length === 0 && o.hasChildren()) for (let [s, a] of Object.entries(o.children)) e[s] = a;
    else (o.segments.length > 0 || o.hasChildren()) && (e[n] = o);
  }
  let r = new W(t.segments, e);
  return ib(r);
}
function ib(t) {
  if (t.numberOfChildren === 1 && t.children[P]) {
    let e = t.children[P];
    return new W(t.segments.concat(e.segments), e.children);
  }
  return t;
}
function pr(t) {
  return t instanceof jt;
}
function ob(t, e, r = null, n = null) {
  let i = Gp(t);
  return qp(i, e, r, n);
}
function Gp(t) {
  let e;
  function r(o) {
    let s = {};
    for (let c of o.children) {
      let l = r(c);
      s[c.outlet] = l;
    }
    let a = new W(o.url, s);
    return o === t && (e = a), a;
  }
  let n = r(t.root),
    i = zp(n);
  return e ?? i;
}
function qp(t, e, r, n) {
  let i = t;
  for (; i.parent; ) i = i.parent;
  if (e.length === 0) return El(i, i, i, r, n);
  let o = sb(e);
  if (o.toRoot()) return El(i, i, new W([], {}), r, n);
  let s = ab(o, i, t),
    a = s.processChildren ? li(s.segmentGroup, s.index, o.commands) : Zp(s.segmentGroup, s.index, o.commands);
  return El(i, s.segmentGroup, a, r, n);
}
function ms(t) {
  return typeof t == 'object' && t != null && !t.outlets && !t.segmentPath;
}
function fi(t) {
  return typeof t == 'object' && t != null && t.outlets;
}
function El(t, e, r, n, i) {
  let o = {};
  n &&
    Object.entries(n).forEach(([c, l]) => {
      o[c] = Array.isArray(l) ? l.map((u) => `${u}`) : `${l}`;
    });
  let s;
  t === e ? (s = r) : (s = Yp(t, e, r));
  let a = zp(Wp(s));
  return new jt(a, o, i);
}
function Yp(t, e, r) {
  let n = {};
  return (
    Object.entries(t.children).forEach(([i, o]) => {
      o === e ? (n[i] = r) : (n[i] = Yp(o, e, r));
    }),
    new W(t.segments, n)
  );
}
var vs = class {
  constructor(e, r, n) {
    if (((this.isAbsolute = e), (this.numberOfDoubleDots = r), (this.commands = n), e && n.length > 0 && ms(n[0]))) throw new M(4003, !1);
    let i = n.find(fi);
    if (i && i !== Lp(n)) throw new M(4004, !1);
  }
  toRoot() {
    return this.isAbsolute && this.commands.length === 1 && this.commands[0] == '/';
  }
};
function sb(t) {
  if (typeof t[0] == 'string' && t.length === 1 && t[0] === '/') return new vs(!0, 0, t);
  let e = 0,
    r = !1,
    n = t.reduce((i, o, s) => {
      if (typeof o == 'object' && o != null) {
        if (o.outlets) {
          let a = {};
          return (
            Object.entries(o.outlets).forEach(([c, l]) => {
              a[c] = typeof l == 'string' ? l.split('/') : l;
            }),
            [...i, { outlets: a }]
          );
        }
        if (o.segmentPath) return [...i, o.segmentPath];
      }
      return typeof o != 'string'
        ? [...i, o]
        : s === 0
          ? (o.split('/').forEach((a, c) => {
              (c == 0 && a === '.') || (c == 0 && a === '' ? (r = !0) : a === '..' ? e++ : a != '' && i.push(a));
            }),
            i)
          : [...i, o];
    }, []);
  return new vs(r, e, n);
}
var dr = class {
  constructor(e, r, n) {
    (this.segmentGroup = e), (this.processChildren = r), (this.index = n);
  }
};
function ab(t, e, r) {
  if (t.isAbsolute) return new dr(e, !0, 0);
  if (!r) return new dr(e, !1, NaN);
  if (r.parent === null) return new dr(r, !0, 0);
  let n = ms(t.commands[0]) ? 0 : 1,
    i = r.segments.length - 1 + n;
  return cb(r, i, t.numberOfDoubleDots);
}
function cb(t, e, r) {
  let n = t,
    i = e,
    o = r;
  for (; o > i; ) {
    if (((o -= i), (n = n.parent), !n)) throw new M(4005, !1);
    i = n.segments.length;
  }
  return new dr(n, !1, i - o);
}
function lb(t) {
  return fi(t[0]) ? t[0].outlets : { [P]: t };
}
function Zp(t, e, r) {
  if ((t || (t = new W([], {})), t.segments.length === 0 && t.hasChildren())) return li(t, e, r);
  let n = ub(t, e, r),
    i = r.slice(n.commandIndex);
  if (n.match && n.pathIndex < t.segments.length) {
    let o = new W(t.segments.slice(0, n.pathIndex), {});
    return (o.children[P] = new W(t.segments.slice(n.pathIndex), t.children)), li(o, 0, i);
  } else
    return n.match && i.length === 0
      ? new W(t.segments, {})
      : n.match && !t.hasChildren()
        ? Ol(t, e, r)
        : n.match
          ? li(t, 0, i)
          : Ol(t, e, r);
}
function li(t, e, r) {
  if (r.length === 0) return new W(t.segments, {});
  {
    let n = lb(r),
      i = {};
    if (Object.keys(n).some((o) => o !== P) && t.children[P] && t.numberOfChildren === 1 && t.children[P].segments.length === 0) {
      let o = li(t.children[P], e, r);
      return new W(t.segments, o.children);
    }
    return (
      Object.entries(n).forEach(([o, s]) => {
        typeof s == 'string' && (s = [s]), s !== null && (i[o] = Zp(t.children[o], e, s));
      }),
      Object.entries(t.children).forEach(([o, s]) => {
        n[o] === void 0 && (i[o] = s);
      }),
      new W(t.segments, i)
    );
  }
}
function ub(t, e, r) {
  let n = 0,
    i = e,
    o = { match: !1, pathIndex: 0, commandIndex: 0 };
  for (; i < t.segments.length; ) {
    if (n >= r.length) return o;
    let s = t.segments[i],
      a = r[n];
    if (fi(a)) break;
    let c = `${a}`,
      l = n < r.length - 1 ? r[n + 1] : null;
    if (i > 0 && c === void 0) break;
    if (c && l && typeof l == 'object' && l.outlets === void 0) {
      if (!Np(c, l, s)) return o;
      n += 2;
    } else {
      if (!Np(c, {}, s)) return o;
      n++;
    }
    i++;
  }
  return { match: !0, pathIndex: i, commandIndex: n };
}
function Ol(t, e, r) {
  let n = t.segments.slice(0, e),
    i = 0;
  for (; i < r.length; ) {
    let o = r[i];
    if (fi(o)) {
      let c = db(o.outlets);
      return new W(n, c);
    }
    if (i === 0 && ms(r[0])) {
      let c = t.segments[e];
      n.push(new ln(c.path, Rp(r[0]))), i++;
      continue;
    }
    let s = fi(o) ? o.outlets[P] : `${o}`,
      a = i < r.length - 1 ? r[i + 1] : null;
    s && a && ms(a) ? (n.push(new ln(s, Rp(a))), (i += 2)) : (n.push(new ln(s, {})), i++);
  }
  return new W(n, {});
}
function db(t) {
  let e = {};
  return (
    Object.entries(t).forEach(([r, n]) => {
      typeof n == 'string' && (n = [n]), n !== null && (e[r] = Ol(new W([], {}), 0, n));
    }),
    e
  );
}
function Rp(t) {
  let e = {};
  return Object.entries(t).forEach(([r, n]) => (e[r] = `${n}`)), e;
}
function Np(t, e, r) {
  return t == r.path && ut(e, r.parameters);
}
var ui = 'imperative',
  He = class {
    constructor(e, r) {
      (this.id = e), (this.url = r);
    }
  },
  hi = class extends He {
    constructor(e, r, n = 'imperative', i = null) {
      super(e, r), (this.type = 0), (this.navigationTrigger = n), (this.restoredState = i);
    }
    toString() {
      return `NavigationStart(id: ${this.id}, url: '${this.url}')`;
    }
  },
  dn = class extends He {
    constructor(e, r, n) {
      super(e, r), (this.urlAfterRedirects = n), (this.type = 1);
    }
    toString() {
      return `NavigationEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}')`;
    }
  },
  Bt = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.reason = n), (this.code = i), (this.type = 2);
    }
    toString() {
      return `NavigationCancel(id: ${this.id}, url: '${this.url}')`;
    }
  },
  fn = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.reason = n), (this.code = i), (this.type = 16);
    }
  },
  pi = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.error = n), (this.target = i), (this.type = 3);
    }
    toString() {
      return `NavigationError(id: ${this.id}, url: '${this.url}', error: ${this.error})`;
    }
  },
  ys = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.urlAfterRedirects = n), (this.state = i), (this.type = 4);
    }
    toString() {
      return `RoutesRecognized(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Rl = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.urlAfterRedirects = n), (this.state = i), (this.type = 7);
    }
    toString() {
      return `GuardsCheckStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Nl = class extends He {
    constructor(e, r, n, i, o) {
      super(e, r), (this.urlAfterRedirects = n), (this.state = i), (this.shouldActivate = o), (this.type = 8);
    }
    toString() {
      return `GuardsCheckEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state}, shouldActivate: ${this.shouldActivate})`;
    }
  },
  Pl = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.urlAfterRedirects = n), (this.state = i), (this.type = 5);
    }
    toString() {
      return `ResolveStart(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  Fl = class extends He {
    constructor(e, r, n, i) {
      super(e, r), (this.urlAfterRedirects = n), (this.state = i), (this.type = 6);
    }
    toString() {
      return `ResolveEnd(id: ${this.id}, url: '${this.url}', urlAfterRedirects: '${this.urlAfterRedirects}', state: ${this.state})`;
    }
  },
  kl = class {
    constructor(e) {
      (this.route = e), (this.type = 9);
    }
    toString() {
      return `RouteConfigLoadStart(path: ${this.route.path})`;
    }
  },
  Ll = class {
    constructor(e) {
      (this.route = e), (this.type = 10);
    }
    toString() {
      return `RouteConfigLoadEnd(path: ${this.route.path})`;
    }
  },
  Vl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 11);
    }
    toString() {
      return `ChildActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  jl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 12);
    }
    toString() {
      return `ChildActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  Bl = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 13);
    }
    toString() {
      return `ActivationStart(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  },
  $l = class {
    constructor(e) {
      (this.snapshot = e), (this.type = 14);
    }
    toString() {
      return `ActivationEnd(path: '${(this.snapshot.routeConfig && this.snapshot.routeConfig.path) || ''}')`;
    }
  };
var gi = class {},
  mi = class {
    constructor(e) {
      this.url = e;
    }
  };
var Ul = class {
    constructor() {
      (this.outlet = null), (this.route = null), (this.injector = null), (this.children = new Es()), (this.attachRef = null);
    }
  },
  Es = (() => {
    let e = class e {
      constructor() {
        this.contexts = new Map();
      }
      onChildOutletCreated(n, i) {
        let o = this.getOrCreateContext(n);
        (o.outlet = i), this.contexts.set(n, o);
      }
      onChildOutletDestroyed(n) {
        let i = this.getContext(n);
        i && ((i.outlet = null), (i.attachRef = null));
      }
      onOutletDeactivated() {
        let n = this.contexts;
        return (this.contexts = new Map()), n;
      }
      onOutletReAttached(n) {
        this.contexts = n;
      }
      getOrCreateContext(n) {
        let i = this.getContext(n);
        return i || ((i = new Ul()), this.contexts.set(n, i)), i;
      }
      getContext(n) {
        return this.contexts.get(n) || null;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  _s = class {
    constructor(e) {
      this._root = e;
    }
    get root() {
      return this._root.value;
    }
    parent(e) {
      let r = this.pathFromRoot(e);
      return r.length > 1 ? r[r.length - 2] : null;
    }
    children(e) {
      let r = Hl(e, this._root);
      return r ? r.children.map((n) => n.value) : [];
    }
    firstChild(e) {
      let r = Hl(e, this._root);
      return r && r.children.length > 0 ? r.children[0].value : null;
    }
    siblings(e) {
      let r = zl(e, this._root);
      return r.length < 2 ? [] : r[r.length - 2].children.map((i) => i.value).filter((i) => i !== e);
    }
    pathFromRoot(e) {
      return zl(e, this._root).map((r) => r.value);
    }
  };
function Hl(t, e) {
  if (t === e.value) return e;
  for (let r of e.children) {
    let n = Hl(t, r);
    if (n) return n;
  }
  return null;
}
function zl(t, e) {
  if (t === e.value) return [e];
  for (let r of e.children) {
    let n = zl(t, r);
    if (n.length) return n.unshift(e), n;
  }
  return [];
}
var ke = class {
  constructor(e, r) {
    (this.value = e), (this.children = r);
  }
  toString() {
    return `TreeNode(${this.value})`;
  }
};
function ur(t) {
  let e = {};
  return t && t.children.forEach((r) => (e[r.value.outlet] = r)), e;
}
var Ds = class extends _s {
  constructor(e, r) {
    super(e), (this.snapshot = r), tu(this, e);
  }
  toString() {
    return this.snapshot.toString();
  }
};
function Kp(t, e) {
  let r = fb(t, e),
    n = new le([new ln('', {})]),
    i = new le({}),
    o = new le({}),
    s = new le({}),
    a = new le(''),
    c = new gr(n, i, s, a, o, P, e, r.root);
  return (c.snapshot = r.root), new Ds(new ke(c, []), r);
}
function fb(t, e) {
  let r = {},
    n = {},
    i = {},
    o = '',
    s = new vi([], r, i, o, n, P, e, null, {});
  return new Cs('', new ke(s, []));
}
var gr = class {
  constructor(e, r, n, i, o, s, a, c) {
    (this.urlSubject = e),
      (this.paramsSubject = r),
      (this.queryParamsSubject = n),
      (this.fragmentSubject = i),
      (this.dataSubject = o),
      (this.outlet = s),
      (this.component = a),
      (this._futureSnapshot = c),
      (this.title = this.dataSubject?.pipe(V((l) => l[Di])) ?? I(void 0)),
      (this.url = e),
      (this.params = r),
      (this.queryParams = n),
      (this.fragment = i),
      (this.data = o);
  }
  get routeConfig() {
    return this._futureSnapshot.routeConfig;
  }
  get root() {
    return this._routerState.root;
  }
  get parent() {
    return this._routerState.parent(this);
  }
  get firstChild() {
    return this._routerState.firstChild(this);
  }
  get children() {
    return this._routerState.children(this);
  }
  get pathFromRoot() {
    return this._routerState.pathFromRoot(this);
  }
  get paramMap() {
    return this._paramMap || (this._paramMap = this.params.pipe(V((e) => hr(e)))), this._paramMap;
  }
  get queryParamMap() {
    return this._queryParamMap || (this._queryParamMap = this.queryParams.pipe(V((e) => hr(e)))), this._queryParamMap;
  }
  toString() {
    return this.snapshot ? this.snapshot.toString() : `Future(${this._futureSnapshot})`;
  }
};
function eu(t, e, r = 'emptyOnly') {
  let n,
    { routeConfig: i } = t;
  return (
    e !== null && (r === 'always' || i?.path === '' || (!e.component && !e.routeConfig?.loadComponent))
      ? (n = {
          params: m(m({}, e.params), t.params),
          data: m(m({}, e.data), t.data),
          resolve: m(m(m(m({}, t.data), e.data), i?.data), t._resolvedData),
        })
      : (n = { params: t.params, data: t.data, resolve: m(m({}, t.data), t._resolvedData ?? {}) }),
    i && Xp(i) && (n.resolve[Di] = i.title),
    n
  );
}
var vi = class {
    get title() {
      return this.data?.[Di];
    }
    constructor(e, r, n, i, o, s, a, c, l) {
      (this.url = e),
        (this.params = r),
        (this.queryParams = n),
        (this.fragment = i),
        (this.data = o),
        (this.outlet = s),
        (this.component = a),
        (this.routeConfig = c),
        (this._resolve = l);
    }
    get root() {
      return this._routerState.root;
    }
    get parent() {
      return this._routerState.parent(this);
    }
    get firstChild() {
      return this._routerState.firstChild(this);
    }
    get children() {
      return this._routerState.children(this);
    }
    get pathFromRoot() {
      return this._routerState.pathFromRoot(this);
    }
    get paramMap() {
      return this._paramMap || (this._paramMap = hr(this.params)), this._paramMap;
    }
    get queryParamMap() {
      return this._queryParamMap || (this._queryParamMap = hr(this.queryParams)), this._queryParamMap;
    }
    toString() {
      let e = this.url.map((n) => n.toString()).join('/'),
        r = this.routeConfig ? this.routeConfig.path : '';
      return `Route(url:'${e}', path:'${r}')`;
    }
  },
  Cs = class extends _s {
    constructor(e, r) {
      super(r), (this.url = e), tu(this, r);
    }
    toString() {
      return Qp(this._root);
    }
  };
function tu(t, e) {
  (e.value._routerState = t), e.children.forEach((r) => tu(t, r));
}
function Qp(t) {
  let e = t.children.length > 0 ? ` { ${t.children.map(Qp).join(', ')} } ` : '';
  return `${t.value}${e}`;
}
function Il(t) {
  if (t.snapshot) {
    let e = t.snapshot,
      r = t._futureSnapshot;
    (t.snapshot = r),
      ut(e.queryParams, r.queryParams) || t.queryParamsSubject.next(r.queryParams),
      e.fragment !== r.fragment && t.fragmentSubject.next(r.fragment),
      ut(e.params, r.params) || t.paramsSubject.next(r.params),
      $w(e.url, r.url) || t.urlSubject.next(r.url),
      ut(e.data, r.data) || t.dataSubject.next(r.data);
  } else (t.snapshot = t._futureSnapshot), t.dataSubject.next(t._futureSnapshot.data);
}
function Wl(t, e) {
  let r = ut(t.params, e.params) && Ww(t.url, e.url),
    n = !t.parent != !e.parent;
  return r && !n && (!t.parent || Wl(t.parent, e.parent));
}
function Xp(t) {
  return typeof t.title == 'string' || t.title === null;
}
var hb = (() => {
    let e = class e {
      constructor() {
        (this.activated = null),
          (this._activatedRoute = null),
          (this.name = P),
          (this.activateEvents = new U()),
          (this.deactivateEvents = new U()),
          (this.attachEvents = new U()),
          (this.detachEvents = new U()),
          (this.parentContexts = _(Es)),
          (this.location = _(Fe)),
          (this.changeDetector = _(wt)),
          (this.environmentInjector = _(Ve)),
          (this.inputBinder = _(nu, { optional: !0 })),
          (this.supportsBindingToComponentInputs = !0);
      }
      get activatedComponentRef() {
        return this.activated;
      }
      ngOnChanges(n) {
        if (n.name) {
          let { firstChange: i, previousValue: o } = n.name;
          if (i) return;
          this.isTrackedInParentContexts(o) && (this.deactivate(), this.parentContexts.onChildOutletDestroyed(o)),
            this.initializeOutletWithName();
        }
      }
      ngOnDestroy() {
        this.isTrackedInParentContexts(this.name) && this.parentContexts.onChildOutletDestroyed(this.name),
          this.inputBinder?.unsubscribeFromRouteData(this);
      }
      isTrackedInParentContexts(n) {
        return this.parentContexts.getContext(n)?.outlet === this;
      }
      ngOnInit() {
        this.initializeOutletWithName();
      }
      initializeOutletWithName() {
        if ((this.parentContexts.onChildOutletCreated(this.name, this), this.activated)) return;
        let n = this.parentContexts.getContext(this.name);
        n?.route && (n.attachRef ? this.attach(n.attachRef, n.route) : this.activateWith(n.route, n.injector));
      }
      get isActivated() {
        return !!this.activated;
      }
      get component() {
        if (!this.activated) throw new M(4012, !1);
        return this.activated.instance;
      }
      get activatedRoute() {
        if (!this.activated) throw new M(4012, !1);
        return this._activatedRoute;
      }
      get activatedRouteData() {
        return this._activatedRoute ? this._activatedRoute.snapshot.data : {};
      }
      detach() {
        if (!this.activated) throw new M(4012, !1);
        this.location.detach();
        let n = this.activated;
        return (this.activated = null), (this._activatedRoute = null), this.detachEvents.emit(n.instance), n;
      }
      attach(n, i) {
        (this.activated = n),
          (this._activatedRoute = i),
          this.location.insert(n.hostView),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.attachEvents.emit(n.instance);
      }
      deactivate() {
        if (this.activated) {
          let n = this.component;
          this.activated.destroy(), (this.activated = null), (this._activatedRoute = null), this.deactivateEvents.emit(n);
        }
      }
      activateWith(n, i) {
        if (this.isActivated) throw new M(4013, !1);
        this._activatedRoute = n;
        let o = this.location,
          a = n.snapshot.component,
          c = this.parentContexts.getOrCreateContext(this.name).children,
          l = new Gl(n, c, o.injector);
        (this.activated = o.createComponent(a, { index: o.length, injector: l, environmentInjector: i ?? this.environmentInjector })),
          this.changeDetector.markForCheck(),
          this.inputBinder?.bindActivatedRouteToOutletComponent(this),
          this.activateEvents.emit(this.activated.instance);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [['router-outlet']],
        inputs: { name: 'name' },
        outputs: { activateEvents: 'activate', deactivateEvents: 'deactivate', attachEvents: 'attach', detachEvents: 'detach' },
        exportAs: ['outlet'],
        standalone: !0,
        features: [ye],
      }));
    let t = e;
    return t;
  })(),
  Gl = class {
    constructor(e, r, n) {
      (this.route = e), (this.childContexts = r), (this.parent = n);
    }
    get(e, r) {
      return e === gr ? this.route : e === Es ? this.childContexts : this.parent.get(e, r);
    }
  },
  nu = new b('');
function pb(t, e, r) {
  let n = yi(t, e._root, r ? r._root : void 0);
  return new Ds(n, e);
}
function yi(t, e, r) {
  if (r && t.shouldReuseRoute(e.value, r.value.snapshot)) {
    let n = r.value;
    n._futureSnapshot = e.value;
    let i = gb(t, e, r);
    return new ke(n, i);
  } else {
    if (t.shouldAttach(e.value)) {
      let o = t.retrieve(e.value);
      if (o !== null) {
        let s = o.route;
        return (s.value._futureSnapshot = e.value), (s.children = e.children.map((a) => yi(t, a))), s;
      }
    }
    let n = mb(e.value),
      i = e.children.map((o) => yi(t, o));
    return new ke(n, i);
  }
}
function gb(t, e, r) {
  return e.children.map((n) => {
    for (let i of r.children) if (t.shouldReuseRoute(n.value, i.value.snapshot)) return yi(t, n, i);
    return yi(t, n);
  });
}
function mb(t) {
  return new gr(new le(t.url), new le(t.params), new le(t.queryParams), new le(t.fragment), new le(t.data), t.outlet, t.component, t);
}
var Jp = 'ngNavigationCancelingError';
function eg(t, e) {
  let { redirectTo: r, navigationBehaviorOptions: n } = pr(e) ? { redirectTo: e, navigationBehaviorOptions: void 0 } : e,
    i = tg(!1, 0, e);
  return (i.url = r), (i.navigationBehaviorOptions = n), i;
}
function tg(t, e, r) {
  let n = new Error('NavigationCancelingError: ' + (t || ''));
  return (n[Jp] = !0), (n.cancellationCode = e), r && (n.url = r), n;
}
function vb(t) {
  return ng(t) && pr(t.url);
}
function ng(t) {
  return t && t[Jp];
}
var yb = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['ng-component']],
      standalone: !0,
      features: [Q],
      decls: 1,
      vars: 0,
      template: function (i, o) {
        i & 1 && we(0, 'router-outlet');
      },
      dependencies: [hb],
      encapsulation: 2,
    }));
  let t = e;
  return t;
})();
function _b(t, e) {
  return t.providers && !t._injector && (t._injector = ol(t.providers, e, `Route: ${t.path}`)), t._injector ?? e;
}
function ru(t) {
  let e = t.children && t.children.map(ru),
    r = e ? G(m({}, t), { children: e }) : m({}, t);
  return !r.component && !r.loadComponent && (e || r.loadChildren) && r.outlet && r.outlet !== P && (r.component = yb), r;
}
function dt(t) {
  return t.outlet || P;
}
function Db(t, e) {
  let r = t.filter((n) => dt(n) === e);
  return r.push(...t.filter((n) => dt(n) !== e)), r;
}
function Ci(t) {
  if (!t) return null;
  if (t.routeConfig?._injector) return t.routeConfig._injector;
  for (let e = t.parent; e; e = e.parent) {
    let r = e.routeConfig;
    if (r?._loadedInjector) return r._loadedInjector;
    if (r?._injector) return r._injector;
  }
  return null;
}
var Cb = (t, e, r, n) => V((i) => (new ql(e, i.targetRouterState, i.currentRouterState, r, n).activate(t), i)),
  ql = class {
    constructor(e, r, n, i, o) {
      (this.routeReuseStrategy = e), (this.futureState = r), (this.currState = n), (this.forwardEvent = i), (this.inputBindingEnabled = o);
    }
    activate(e) {
      let r = this.futureState._root,
        n = this.currState ? this.currState._root : null;
      this.deactivateChildRoutes(r, n, e), Il(this.futureState.root), this.activateChildRoutes(r, n, e);
    }
    deactivateChildRoutes(e, r, n) {
      let i = ur(r);
      e.children.forEach((o) => {
        let s = o.value.outlet;
        this.deactivateRoutes(o, i[s], n), delete i[s];
      }),
        Object.values(i).forEach((o) => {
          this.deactivateRouteAndItsChildren(o, n);
        });
    }
    deactivateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if (i === o)
        if (i.component) {
          let s = n.getContext(i.outlet);
          s && this.deactivateChildRoutes(e, r, s.children);
        } else this.deactivateChildRoutes(e, r, n);
      else o && this.deactivateRouteAndItsChildren(r, n);
    }
    deactivateRouteAndItsChildren(e, r) {
      e.value.component && this.routeReuseStrategy.shouldDetach(e.value.snapshot)
        ? this.detachAndStoreRouteSubtree(e, r)
        : this.deactivateRouteAndOutlet(e, r);
    }
    detachAndStoreRouteSubtree(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = ur(e);
      for (let s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
      if (n && n.outlet) {
        let s = n.outlet.detach(),
          a = n.children.onOutletDeactivated();
        this.routeReuseStrategy.store(e.value.snapshot, { componentRef: s, route: e, contexts: a });
      }
    }
    deactivateRouteAndOutlet(e, r) {
      let n = r.getContext(e.value.outlet),
        i = n && e.value.component ? n.children : r,
        o = ur(e);
      for (let s of Object.keys(o)) this.deactivateRouteAndItsChildren(o[s], i);
      n && (n.outlet && (n.outlet.deactivate(), n.children.onOutletDeactivated()), (n.attachRef = null), (n.route = null));
    }
    activateChildRoutes(e, r, n) {
      let i = ur(r);
      e.children.forEach((o) => {
        this.activateRoutes(o, i[o.value.outlet], n), this.forwardEvent(new $l(o.value.snapshot));
      }),
        e.children.length && this.forwardEvent(new jl(e.value.snapshot));
    }
    activateRoutes(e, r, n) {
      let i = e.value,
        o = r ? r.value : null;
      if ((Il(i), i === o))
        if (i.component) {
          let s = n.getOrCreateContext(i.outlet);
          this.activateChildRoutes(e, r, s.children);
        } else this.activateChildRoutes(e, r, n);
      else if (i.component) {
        let s = n.getOrCreateContext(i.outlet);
        if (this.routeReuseStrategy.shouldAttach(i.snapshot)) {
          let a = this.routeReuseStrategy.retrieve(i.snapshot);
          this.routeReuseStrategy.store(i.snapshot, null),
            s.children.onOutletReAttached(a.contexts),
            (s.attachRef = a.componentRef),
            (s.route = a.route.value),
            s.outlet && s.outlet.attach(a.componentRef, a.route.value),
            Il(a.route.value),
            this.activateChildRoutes(e, null, s.children);
        } else {
          let a = Ci(i.snapshot);
          (s.attachRef = null),
            (s.route = i),
            (s.injector = a),
            s.outlet && s.outlet.activateWith(i, s.injector),
            this.activateChildRoutes(e, null, s.children);
        }
      } else this.activateChildRoutes(e, null, n);
    }
  },
  ws = class {
    constructor(e) {
      (this.path = e), (this.route = this.path[this.path.length - 1]);
    }
  },
  fr = class {
    constructor(e, r) {
      (this.component = e), (this.route = r);
    }
  };
function wb(t, e, r) {
  let n = t._root,
    i = e ? e._root : null;
  return ai(n, i, r, [n.value]);
}
function bb(t) {
  let e = t.routeConfig ? t.routeConfig.canActivateChild : null;
  return !e || e.length === 0 ? null : { node: t, guards: e };
}
function vr(t, e) {
  let r = Symbol(),
    n = e.get(t, r);
  return n === r ? (typeof t == 'function' && !of(t) ? t : e.get(t)) : n;
}
function ai(t, e, r, n, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = ur(e);
  return (
    t.children.forEach((s) => {
      Eb(s, o[s.value.outlet], r, n.concat([s.value]), i), delete o[s.value.outlet];
    }),
    Object.entries(o).forEach(([s, a]) => di(a, r.getContext(s), i)),
    i
  );
}
function Eb(t, e, r, n, i = { canDeactivateChecks: [], canActivateChecks: [] }) {
  let o = t.value,
    s = e ? e.value : null,
    a = r ? r.getContext(t.value.outlet) : null;
  if (s && o.routeConfig === s.routeConfig) {
    let c = Ib(s, o, o.routeConfig.runGuardsAndResolvers);
    c ? i.canActivateChecks.push(new ws(n)) : ((o.data = s.data), (o._resolvedData = s._resolvedData)),
      o.component ? ai(t, e, a ? a.children : null, n, i) : ai(t, e, r, n, i),
      c && a && a.outlet && a.outlet.isActivated && i.canDeactivateChecks.push(new fr(a.outlet.component, s));
  } else
    s && di(e, a, i), i.canActivateChecks.push(new ws(n)), o.component ? ai(t, null, a ? a.children : null, n, i) : ai(t, null, r, n, i);
  return i;
}
function Ib(t, e, r) {
  if (typeof r == 'function') return r(t, e);
  switch (r) {
    case 'pathParamsChange':
      return !un(t.url, e.url);
    case 'pathParamsOrQueryParamsChange':
      return !un(t.url, e.url) || !ut(t.queryParams, e.queryParams);
    case 'always':
      return !0;
    case 'paramsOrQueryParamsChange':
      return !Wl(t, e) || !ut(t.queryParams, e.queryParams);
    case 'paramsChange':
    default:
      return !Wl(t, e);
  }
}
function di(t, e, r) {
  let n = ur(t),
    i = t.value;
  Object.entries(n).forEach(([o, s]) => {
    i.component ? (e ? di(s, e.children.getContext(o), r) : di(s, null, r)) : di(s, e, r);
  }),
    i.component
      ? e && e.outlet && e.outlet.isActivated
        ? r.canDeactivateChecks.push(new fr(e.outlet.component, i))
        : r.canDeactivateChecks.push(new fr(null, i))
      : r.canDeactivateChecks.push(new fr(null, i));
}
function wi(t) {
  return typeof t == 'function';
}
function Mb(t) {
  return typeof t == 'boolean';
}
function Sb(t) {
  return t && wi(t.canLoad);
}
function xb(t) {
  return t && wi(t.canActivate);
}
function Ab(t) {
  return t && wi(t.canActivateChild);
}
function Tb(t) {
  return t && wi(t.canDeactivate);
}
function Ob(t) {
  return t && wi(t.canMatch);
}
function rg(t) {
  return t instanceof gt || t?.name === 'EmptyError';
}
var ds = Symbol('INITIAL_VALUE');
function mr() {
  return xe((t) =>
    so(t.map((e) => e.pipe(me(1), Ln(ds)))).pipe(
      V((e) => {
        for (let r of e)
          if (r !== !0) {
            if (r === ds) return ds;
            if (r === !1 || r instanceof jt) return r;
          }
        return !0;
      }),
      fe((e) => e !== ds),
      me(1),
    ),
  );
}
function Rb(t, e) {
  return ie((r) => {
    let {
      targetSnapshot: n,
      currentSnapshot: i,
      guards: { canActivateChecks: o, canDeactivateChecks: s },
    } = r;
    return s.length === 0 && o.length === 0
      ? I(G(m({}, r), { guardsResult: !0 }))
      : Nb(s, n, i, t).pipe(
          ie((a) => (a && Mb(a) ? Pb(n, o, t, e) : I(a))),
          V((a) => G(m({}, r), { guardsResult: a })),
        );
  });
}
function Nb(t, e, r, n) {
  return ne(t).pipe(
    ie((i) => jb(i.component, i.route, r, e, n)),
    tt((i) => i !== !0, !0),
  );
}
function Pb(t, e, r, n) {
  return ne(e).pipe(
    Pn((i) => Rn(kb(i.route.parent, n), Fb(i.route, n), Vb(t, i.path, r), Lb(t, i.route, r))),
    tt((i) => i !== !0, !0),
  );
}
function Fb(t, e) {
  return t !== null && e && e(new Bl(t)), I(!0);
}
function kb(t, e) {
  return t !== null && e && e(new Vl(t)), I(!0);
}
function Lb(t, e, r) {
  let n = e.routeConfig ? e.routeConfig.canActivate : null;
  if (!n || n.length === 0) return I(!0);
  let i = n.map((o) =>
    Nn(() => {
      let s = Ci(e) ?? r,
        a = vr(o, s),
        c = xb(a) ? a.canActivate(e, t) : s.runInContext(() => a(e, t));
      return $t(c).pipe(tt());
    }),
  );
  return I(i).pipe(mr());
}
function Vb(t, e, r) {
  let n = e[e.length - 1],
    o = e
      .slice(0, e.length - 1)
      .reverse()
      .map((s) => bb(s))
      .filter((s) => s !== null)
      .map((s) =>
        Nn(() => {
          let a = s.guards.map((c) => {
            let l = Ci(s.node) ?? r,
              u = vr(c, l),
              d = Ab(u) ? u.canActivateChild(n, t) : l.runInContext(() => u(n, t));
            return $t(d).pipe(tt());
          });
          return I(a).pipe(mr());
        }),
      );
  return I(o).pipe(mr());
}
function jb(t, e, r, n, i) {
  let o = e && e.routeConfig ? e.routeConfig.canDeactivate : null;
  if (!o || o.length === 0) return I(!0);
  let s = o.map((a) => {
    let c = Ci(e) ?? i,
      l = vr(a, c),
      u = Tb(l) ? l.canDeactivate(t, e, r, n) : c.runInContext(() => l(t, e, r, n));
    return $t(u).pipe(tt());
  });
  return I(s).pipe(mr());
}
function Bb(t, e, r, n) {
  let i = e.canLoad;
  if (i === void 0 || i.length === 0) return I(!0);
  let o = i.map((s) => {
    let a = vr(s, t),
      c = Sb(a) ? a.canLoad(e, r) : t.runInContext(() => a(e, r));
    return $t(c);
  });
  return I(o).pipe(mr(), ig(n));
}
function ig(t) {
  return sa(
    ue((e) => {
      if (pr(e)) throw eg(t, e);
    }),
    V((e) => e === !0),
  );
}
function $b(t, e, r, n) {
  let i = e.canMatch;
  if (!i || i.length === 0) return I(!0);
  let o = i.map((s) => {
    let a = vr(s, t),
      c = Ob(a) ? a.canMatch(e, r) : t.runInContext(() => a(e, r));
    return $t(c);
  });
  return I(o).pipe(mr(), ig(n));
}
var _i = class {
    constructor(e) {
      this.segmentGroup = e || null;
    }
  },
  bs = class extends Error {
    constructor(e) {
      super(), (this.urlTree = e);
    }
  };
function lr(t) {
  return Tn(new _i(t));
}
function Ub(t) {
  return Tn(new M(4e3, !1));
}
function Hb(t) {
  return Tn(tg(!1, 3));
}
var Yl = class {
    constructor(e, r) {
      (this.urlSerializer = e), (this.urlTree = r);
    }
    noMatchError(e) {
      return new M(4002, !1);
    }
    lineralizeSegments(e, r) {
      let n = [],
        i = r.root;
      for (;;) {
        if (((n = n.concat(i.segments)), i.numberOfChildren === 0)) return I(n);
        if (i.numberOfChildren > 1 || !i.children[P]) return Ub(e.redirectTo);
        i = i.children[P];
      }
    }
    applyRedirectCommands(e, r, n) {
      let i = this.applyRedirectCreateUrlTree(r, this.urlSerializer.parse(r), e, n);
      if (r.startsWith('/')) throw new bs(i);
      return i;
    }
    applyRedirectCreateUrlTree(e, r, n, i) {
      let o = this.createSegmentGroup(e, r.root, n, i);
      return new jt(o, this.createQueryParams(r.queryParams, this.urlTree.queryParams), r.fragment);
    }
    createQueryParams(e, r) {
      let n = {};
      return (
        Object.entries(e).forEach(([i, o]) => {
          if (typeof o == 'string' && o.startsWith(':')) {
            let a = o.substring(1);
            n[i] = r[a];
          } else n[i] = o;
        }),
        n
      );
    }
    createSegmentGroup(e, r, n, i) {
      let o = this.createSegments(e, r.segments, n, i),
        s = {};
      return (
        Object.entries(r.children).forEach(([a, c]) => {
          s[a] = this.createSegmentGroup(e, c, n, i);
        }),
        new W(o, s)
      );
    }
    createSegments(e, r, n, i) {
      return r.map((o) => (o.path.startsWith(':') ? this.findPosParam(e, o, i) : this.findOrReturn(o, n)));
    }
    findPosParam(e, r, n) {
      let i = n[r.path.substring(1)];
      if (!i) throw new M(4001, !1);
      return i;
    }
    findOrReturn(e, r) {
      let n = 0;
      for (let i of r) {
        if (i.path === e.path) return r.splice(n), i;
        n++;
      }
      return e;
    }
  },
  Zl = { matched: !1, consumedSegments: [], remainingSegments: [], parameters: {}, positionalParamSegments: {} };
function zb(t, e, r, n, i) {
  let o = iu(t, e, r);
  return o.matched ? ((n = _b(e, n)), $b(n, e, r, i).pipe(V((s) => (s === !0 ? o : m({}, Zl))))) : I(o);
}
function iu(t, e, r) {
  if (e.path === '')
    return e.pathMatch === 'full' && (t.hasChildren() || r.length > 0)
      ? m({}, Zl)
      : { matched: !0, consumedSegments: [], remainingSegments: r, parameters: {}, positionalParamSegments: {} };
  let i = (e.matcher || Bw)(r, t, e);
  if (!i) return m({}, Zl);
  let o = {};
  Object.entries(i.posParams ?? {}).forEach(([a, c]) => {
    o[a] = c.path;
  });
  let s = i.consumed.length > 0 ? m(m({}, o), i.consumed[i.consumed.length - 1].parameters) : o;
  return {
    matched: !0,
    consumedSegments: i.consumed,
    remainingSegments: r.slice(i.consumed.length),
    parameters: s,
    positionalParamSegments: i.posParams ?? {},
  };
}
function Pp(t, e, r, n) {
  return r.length > 0 && qb(t, r, n)
    ? { segmentGroup: new W(e, Gb(n, new W(r, t.children))), slicedSegments: [] }
    : r.length === 0 && Yb(t, r, n)
      ? { segmentGroup: new W(t.segments, Wb(t, e, r, n, t.children)), slicedSegments: r }
      : { segmentGroup: new W(t.segments, t.children), slicedSegments: r };
}
function Wb(t, e, r, n, i) {
  let o = {};
  for (let s of n)
    if (Is(t, r, s) && !i[dt(s)]) {
      let a = new W([], {});
      o[dt(s)] = a;
    }
  return m(m({}, i), o);
}
function Gb(t, e) {
  let r = {};
  r[P] = e;
  for (let n of t)
    if (n.path === '' && dt(n) !== P) {
      let i = new W([], {});
      r[dt(n)] = i;
    }
  return r;
}
function qb(t, e, r) {
  return r.some((n) => Is(t, e, n) && dt(n) !== P);
}
function Yb(t, e, r) {
  return r.some((n) => Is(t, e, n));
}
function Is(t, e, r) {
  return (t.hasChildren() || e.length > 0) && r.pathMatch === 'full' ? !1 : r.path === '';
}
function Zb(t, e, r, n) {
  return dt(t) !== n && (n === P || !Is(e, r, t)) ? !1 : t.path === '**' ? !0 : iu(e, t, r).matched;
}
function Kb(t, e, r) {
  return e.length === 0 && !t.children[r];
}
var Kl = class {};
function Qb(t, e, r, n, i, o, s = 'emptyOnly') {
  return new Ql(t, e, r, n, i, s, o).recognize();
}
var Xb = 31,
  Ql = class {
    constructor(e, r, n, i, o, s, a) {
      (this.injector = e),
        (this.configLoader = r),
        (this.rootComponentType = n),
        (this.config = i),
        (this.urlTree = o),
        (this.paramsInheritanceStrategy = s),
        (this.urlSerializer = a),
        (this.applyRedirects = new Yl(this.urlSerializer, this.urlTree)),
        (this.absoluteRedirectCount = 0),
        (this.allowRedirects = !0);
    }
    noMatchError(e) {
      return new M(4002, !1);
    }
    recognize() {
      let e = Pp(this.urlTree.root, [], [], this.config).segmentGroup;
      return this.match(e).pipe(
        V((r) => {
          let n = new vi(
              [],
              Object.freeze({}),
              Object.freeze(m({}, this.urlTree.queryParams)),
              this.urlTree.fragment,
              {},
              P,
              this.rootComponentType,
              null,
              {},
            ),
            i = new ke(n, r),
            o = new Cs('', i),
            s = ob(n, [], this.urlTree.queryParams, this.urlTree.fragment);
          return (
            (s.queryParams = this.urlTree.queryParams),
            (o.url = this.urlSerializer.serialize(s)),
            this.inheritParamsAndData(o._root, null),
            { state: o, tree: s }
          );
        }),
      );
    }
    match(e) {
      return this.processSegmentGroup(this.injector, this.config, e, P).pipe(
        Tt((n) => {
          if (n instanceof bs) return (this.urlTree = n.urlTree), this.match(n.urlTree.root);
          throw n instanceof _i ? this.noMatchError(n) : n;
        }),
      );
    }
    inheritParamsAndData(e, r) {
      let n = e.value,
        i = eu(n, r, this.paramsInheritanceStrategy);
      (n.params = Object.freeze(i.params)), (n.data = Object.freeze(i.data)), e.children.forEach((o) => this.inheritParamsAndData(o, n));
    }
    processSegmentGroup(e, r, n, i) {
      return n.segments.length === 0 && n.hasChildren()
        ? this.processChildren(e, r, n)
        : this.processSegment(e, r, n, n.segments, i, !0).pipe(V((o) => (o instanceof ke ? [o] : [])));
    }
    processChildren(e, r, n) {
      let i = [];
      for (let o of Object.keys(n.children)) o === 'primary' ? i.unshift(o) : i.push(o);
      return ne(i).pipe(
        Pn((o) => {
          let s = n.children[o],
            a = Db(r, o);
          return this.processSegmentGroup(e, a, s, o);
        }),
        ma((o, s) => (o.push(...s), o)),
        Ot(null),
        ga(),
        ie((o) => {
          if (o === null) return lr(n);
          let s = og(o);
          return Jb(s), I(s);
        }),
      );
    }
    processSegment(e, r, n, i, o, s) {
      return ne(r).pipe(
        Pn((a) =>
          this.processSegmentAgainstRoute(a._injector ?? e, r, a, n, i, o, s).pipe(
            Tt((c) => {
              if (c instanceof _i) return I(null);
              throw c;
            }),
          ),
        ),
        tt((a) => !!a),
        Tt((a) => {
          if (rg(a)) return Kb(n, i, o) ? I(new Kl()) : lr(n);
          throw a;
        }),
      );
    }
    processSegmentAgainstRoute(e, r, n, i, o, s, a) {
      return Zb(n, i, o, s)
        ? n.redirectTo === void 0
          ? this.matchSegmentAgainstRoute(e, i, n, o, s)
          : this.allowRedirects && a
            ? this.expandSegmentAgainstRouteUsingRedirect(e, i, r, n, o, s)
            : lr(i)
        : lr(i);
    }
    expandSegmentAgainstRouteUsingRedirect(e, r, n, i, o, s) {
      let { matched: a, consumedSegments: c, positionalParamSegments: l, remainingSegments: u } = i.path === '**' ? Fp(o) : iu(r, i, o);
      if (!a) return lr(r);
      i.redirectTo.startsWith('/') && (this.absoluteRedirectCount++, this.absoluteRedirectCount > Xb && (this.allowRedirects = !1));
      let d = this.applyRedirects.applyRedirectCommands(c, i.redirectTo, l);
      return this.applyRedirects.lineralizeSegments(i, d).pipe(ie((f) => this.processSegment(e, n, r, f.concat(u), s, !1)));
    }
    matchSegmentAgainstRoute(e, r, n, i, o) {
      let s;
      return (
        n.path === '**' ? ((s = I(Fp(i))), (r.children = {})) : (s = zb(r, n, i, e, this.urlSerializer)),
        s.pipe(
          xe((a) =>
            a.matched
              ? ((e = n._injector ?? e),
                this.getChildConfig(e, n, i).pipe(
                  xe(({ routes: c }) => {
                    let l = n._loadedInjector ?? e,
                      { consumedSegments: u, remainingSegments: d, parameters: f } = a,
                      h = new vi(
                        u,
                        f,
                        Object.freeze(m({}, this.urlTree.queryParams)),
                        this.urlTree.fragment,
                        tE(n),
                        dt(n),
                        n.component ?? n._loadedComponent ?? null,
                        n,
                        nE(n),
                      ),
                      { segmentGroup: g, slicedSegments: w } = Pp(r, u, d, c);
                    if (w.length === 0 && g.hasChildren())
                      return this.processChildren(l, c, g).pipe(V((F) => (F === null ? null : new ke(h, F))));
                    if (c.length === 0 && w.length === 0) return I(new ke(h, []));
                    let H = dt(n) === o;
                    return this.processSegment(l, c, g, w, H ? P : o, !0).pipe(V((F) => new ke(h, F instanceof ke ? [F] : [])));
                  }),
                ))
              : lr(r),
          ),
        )
      );
    }
    getChildConfig(e, r, n) {
      return r.children
        ? I({ routes: r.children, injector: e })
        : r.loadChildren
          ? r._loadedRoutes !== void 0
            ? I({ routes: r._loadedRoutes, injector: r._loadedInjector })
            : Bb(e, r, n, this.urlSerializer).pipe(
                ie((i) =>
                  i
                    ? this.configLoader.loadChildren(e, r).pipe(
                        ue((o) => {
                          (r._loadedRoutes = o.routes), (r._loadedInjector = o.injector);
                        }),
                      )
                    : Hb(r),
                ),
              )
          : I({ routes: [], injector: e });
    }
  };
function Jb(t) {
  t.sort((e, r) => (e.value.outlet === P ? -1 : r.value.outlet === P ? 1 : e.value.outlet.localeCompare(r.value.outlet)));
}
function eE(t) {
  let e = t.value.routeConfig;
  return e && e.path === '';
}
function og(t) {
  let e = [],
    r = new Set();
  for (let n of t) {
    if (!eE(n)) {
      e.push(n);
      continue;
    }
    let i = e.find((o) => n.value.routeConfig === o.value.routeConfig);
    i !== void 0 ? (i.children.push(...n.children), r.add(i)) : e.push(n);
  }
  for (let n of r) {
    let i = og(n.children);
    e.push(new ke(n.value, i));
  }
  return e.filter((n) => !r.has(n));
}
function tE(t) {
  return t.data || {};
}
function nE(t) {
  return t.resolve || {};
}
function Fp(t) {
  return {
    matched: !0,
    parameters: t.length > 0 ? Lp(t).parameters : {},
    consumedSegments: t,
    remainingSegments: [],
    positionalParamSegments: {},
  };
}
function rE(t, e, r, n, i, o) {
  return ie((s) =>
    Qb(t, e, r, n, s.extractedUrl, i, o).pipe(V(({ state: a, tree: c }) => G(m({}, s), { targetSnapshot: a, urlAfterRedirects: c }))),
  );
}
function iE(t, e) {
  return ie((r) => {
    let {
      targetSnapshot: n,
      guards: { canActivateChecks: i },
    } = r;
    if (!i.length) return I(r);
    let o = i.map((l) => l.route),
      s = new Set(o),
      a = sg(o[0].parent).slice(1),
      c = 0;
    return ne(a).pipe(
      Pn((l) => (s.has(l) ? oE(l, n, t, e) : ((l.data = eu(l, l.parent, t).resolve), I(void 0)))),
      ue(() => c++),
      kn(1),
      ie((l) => (c === a.length ? I(r) : Me)),
    );
  });
}
function sg(t) {
  let e = t.children.map((r) => sg(r)).flat();
  return [t, ...e];
}
function oE(t, e, r, n) {
  let i = t.routeConfig,
    o = t._resolve;
  return (
    i?.title !== void 0 && !Xp(i) && (o[Di] = i.title),
    sE(o, t, e, n).pipe(V((s) => ((t._resolvedData = s), (t.data = eu(t, t.parent, r).resolve), null)))
  );
}
function sE(t, e, r, n) {
  let i = xl(t);
  if (i.length === 0) return I({});
  let o = {};
  return ne(i).pipe(
    ie((s) =>
      aE(t[s], e, r, n).pipe(
        tt(),
        ue((a) => {
          o[s] = a;
        }),
      ),
    ),
    kn(1),
    pa(o),
    Tt((s) => (rg(s) ? Me : Tn(s))),
  );
}
function aE(t, e, r, n) {
  let i = Ci(e) ?? n,
    o = vr(t, i),
    s = o.resolve ? o.resolve(e, r) : i.runInContext(() => o(e, r));
  return $t(s);
}
function Ml(t) {
  return xe((e) => {
    let r = t(e);
    return r ? ne(r).pipe(V(() => e)) : I(e);
  });
}
var ag = (() => {
    let e = class e {
      buildTitle(n) {
        let i,
          o = n.root;
        for (; o !== void 0; ) (i = this.getResolvedTitleForRoute(o) ?? i), (o = o.children.find((s) => s.outlet === P));
        return i;
      }
      getResolvedTitleForRoute(n) {
        return n.data[Di];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(cE))(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  cE = (() => {
    let e = class e extends ag {
      constructor(n) {
        super(), (this.title = n);
      }
      updateTitle(n) {
        let i = this.buildTitle(n);
        i !== void 0 && this.title.setTitle(i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(wl));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  ou = new b('', { providedIn: 'root', factory: () => ({}) }),
  su = new b('ROUTES'),
  lE = (() => {
    let e = class e {
      constructor() {
        (this.componentLoaders = new WeakMap()), (this.childrenLoaders = new WeakMap()), (this.compiler = _(ll));
      }
      loadComponent(n) {
        if (this.componentLoaders.get(n)) return this.componentLoaders.get(n);
        if (n._loadedComponent) return I(n._loadedComponent);
        this.onLoadStartListener && this.onLoadStartListener(n);
        let i = $t(n.loadComponent()).pipe(
            V(cg),
            ue((s) => {
              this.onLoadEndListener && this.onLoadEndListener(n), (n._loadedComponent = s);
            }),
            Or(() => {
              this.componentLoaders.delete(n);
            }),
          ),
          o = new Sn(i, () => new $()).pipe(Mn());
        return this.componentLoaders.set(n, o), o;
      }
      loadChildren(n, i) {
        if (this.childrenLoaders.get(i)) return this.childrenLoaders.get(i);
        if (i._loadedRoutes) return I({ routes: i._loadedRoutes, injector: i._loadedInjector });
        this.onLoadStartListener && this.onLoadStartListener(i);
        let s = uE(i, this.compiler, n, this.onLoadEndListener).pipe(
            Or(() => {
              this.childrenLoaders.delete(i);
            }),
          ),
          a = new Sn(s, () => new $()).pipe(Mn());
        return this.childrenLoaders.set(i, a), a;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function uE(t, e, r, n) {
  return $t(t.loadChildren()).pipe(
    V(cg),
    ie((i) => (i instanceof Gr || Array.isArray(i) ? I(i) : ne(e.compileModuleAsync(i)))),
    V((i) => {
      n && n(t);
      let o,
        s,
        a = !1;
      return (
        Array.isArray(i) ? ((s = i), (a = !0)) : ((o = i.create(r).injector), (s = o.get(su, [], { optional: !0, self: !0 }).flat())),
        { routes: s.map(ru), injector: o }
      );
    }),
  );
}
function dE(t) {
  return t && typeof t == 'object' && 'default' in t;
}
function cg(t) {
  return dE(t) ? t.default : t;
}
var au = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(fE))(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  fE = (() => {
    let e = class e {
      shouldProcessUrl(n) {
        return !0;
      }
      extract(n) {
        return n;
      }
      merge(n, i) {
        return n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  hE = new b('');
var pE = (() => {
  let e = class e {
    get hasRequestedNavigation() {
      return this.navigationId !== 0;
    }
    constructor() {
      (this.currentNavigation = null),
        (this.currentTransition = null),
        (this.lastSuccessfulNavigation = null),
        (this.events = new $()),
        (this.transitionAbortSubject = new $()),
        (this.configLoader = _(lE)),
        (this.environmentInjector = _(Ve)),
        (this.urlSerializer = _(Jl)),
        (this.rootContexts = _(Es)),
        (this.location = _(cn)),
        (this.inputBindingEnabled = _(nu, { optional: !0 }) !== null),
        (this.titleStrategy = _(ag)),
        (this.options = _(ou, { optional: !0 }) || {}),
        (this.paramsInheritanceStrategy = this.options.paramsInheritanceStrategy || 'emptyOnly'),
        (this.urlHandlingStrategy = _(au)),
        (this.createViewTransition = _(hE, { optional: !0 })),
        (this.navigationId = 0),
        (this.afterPreactivation = () => I(void 0)),
        (this.rootComponentType = null);
      let n = (o) => this.events.next(new kl(o)),
        i = (o) => this.events.next(new Ll(o));
      (this.configLoader.onLoadEndListener = i), (this.configLoader.onLoadStartListener = n);
    }
    complete() {
      this.transitions?.complete();
    }
    handleNavigationRequest(n) {
      let i = ++this.navigationId;
      this.transitions?.next(G(m(m({}, this.transitions.value), n), { id: i }));
    }
    setupNavigations(n, i, o) {
      return (
        (this.transitions = new le({
          id: 0,
          currentUrlTree: i,
          currentRawUrl: i,
          extractedUrl: this.urlHandlingStrategy.extract(i),
          urlAfterRedirects: this.urlHandlingStrategy.extract(i),
          rawUrl: i,
          extras: {},
          resolve: null,
          reject: null,
          promise: Promise.resolve(!0),
          source: ui,
          restoredState: null,
          currentSnapshot: o.snapshot,
          targetSnapshot: null,
          currentRouterState: o,
          targetRouterState: null,
          guards: { canActivateChecks: [], canDeactivateChecks: [] },
          guardsResult: null,
        })),
        this.transitions.pipe(
          fe((s) => s.id !== 0),
          V((s) => G(m({}, s), { extractedUrl: this.urlHandlingStrategy.extract(s.rawUrl) })),
          xe((s) => {
            this.currentTransition = s;
            let a = !1,
              c = !1;
            return I(s).pipe(
              ue((l) => {
                this.currentNavigation = {
                  id: l.id,
                  initialUrl: l.rawUrl,
                  extractedUrl: l.extractedUrl,
                  trigger: l.source,
                  extras: l.extras,
                  previousNavigation: this.lastSuccessfulNavigation
                    ? G(m({}, this.lastSuccessfulNavigation), { previousNavigation: null })
                    : null,
                };
              }),
              xe((l) => {
                let u = !n.navigated || this.isUpdatingInternalState() || this.isUpdatedBrowserUrl(),
                  d = l.extras.onSameUrlNavigation ?? n.onSameUrlNavigation;
                if (!u && d !== 'reload') {
                  let f = '';
                  return this.events.next(new fn(l.id, this.urlSerializer.serialize(l.rawUrl), f, 0)), l.resolve(null), Me;
                }
                if (this.urlHandlingStrategy.shouldProcessUrl(l.rawUrl))
                  return I(l).pipe(
                    xe((f) => {
                      let h = this.transitions?.getValue();
                      return (
                        this.events.next(new hi(f.id, this.urlSerializer.serialize(f.extractedUrl), f.source, f.restoredState)),
                        h !== this.transitions?.getValue() ? Me : Promise.resolve(f)
                      );
                    }),
                    rE(
                      this.environmentInjector,
                      this.configLoader,
                      this.rootComponentType,
                      n.config,
                      this.urlSerializer,
                      this.paramsInheritanceStrategy,
                    ),
                    ue((f) => {
                      (s.targetSnapshot = f.targetSnapshot),
                        (s.urlAfterRedirects = f.urlAfterRedirects),
                        (this.currentNavigation = G(m({}, this.currentNavigation), { finalUrl: f.urlAfterRedirects }));
                      let h = new ys(
                        f.id,
                        this.urlSerializer.serialize(f.extractedUrl),
                        this.urlSerializer.serialize(f.urlAfterRedirects),
                        f.targetSnapshot,
                      );
                      this.events.next(h);
                    }),
                  );
                if (u && this.urlHandlingStrategy.shouldProcessUrl(l.currentRawUrl)) {
                  let { id: f, extractedUrl: h, source: g, restoredState: w, extras: H } = l,
                    F = new hi(f, this.urlSerializer.serialize(h), g, w);
                  this.events.next(F);
                  let Ee = Kp(h, this.rootComponentType).snapshot;
                  return (
                    (this.currentTransition = s =
                      G(m({}, l), {
                        targetSnapshot: Ee,
                        urlAfterRedirects: h,
                        extras: G(m({}, H), { skipLocationChange: !1, replaceUrl: !1 }),
                      })),
                    (this.currentNavigation.finalUrl = h),
                    I(s)
                  );
                } else {
                  let f = '';
                  return this.events.next(new fn(l.id, this.urlSerializer.serialize(l.extractedUrl), f, 1)), l.resolve(null), Me;
                }
              }),
              ue((l) => {
                let u = new Rl(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                );
                this.events.next(u);
              }),
              V(
                (l) => (
                  (this.currentTransition = s = G(m({}, l), { guards: wb(l.targetSnapshot, l.currentSnapshot, this.rootContexts) })), s
                ),
              ),
              Rb(this.environmentInjector, (l) => this.events.next(l)),
              ue((l) => {
                if (((s.guardsResult = l.guardsResult), pr(l.guardsResult))) throw eg(this.urlSerializer, l.guardsResult);
                let u = new Nl(
                  l.id,
                  this.urlSerializer.serialize(l.extractedUrl),
                  this.urlSerializer.serialize(l.urlAfterRedirects),
                  l.targetSnapshot,
                  !!l.guardsResult,
                );
                this.events.next(u);
              }),
              fe((l) => (l.guardsResult ? !0 : (this.cancelNavigationTransition(l, '', 3), !1))),
              Ml((l) => {
                if (l.guards.canActivateChecks.length)
                  return I(l).pipe(
                    ue((u) => {
                      let d = new Pl(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                    xe((u) => {
                      let d = !1;
                      return I(u).pipe(
                        iE(this.paramsInheritanceStrategy, this.environmentInjector),
                        ue({
                          next: () => (d = !0),
                          complete: () => {
                            d || this.cancelNavigationTransition(u, '', 2);
                          },
                        }),
                      );
                    }),
                    ue((u) => {
                      let d = new Fl(
                        u.id,
                        this.urlSerializer.serialize(u.extractedUrl),
                        this.urlSerializer.serialize(u.urlAfterRedirects),
                        u.targetSnapshot,
                      );
                      this.events.next(d);
                    }),
                  );
              }),
              Ml((l) => {
                let u = (d) => {
                  let f = [];
                  d.routeConfig?.loadComponent &&
                    !d.routeConfig._loadedComponent &&
                    f.push(
                      this.configLoader.loadComponent(d.routeConfig).pipe(
                        ue((h) => {
                          d.component = h;
                        }),
                        V(() => {}),
                      ),
                    );
                  for (let h of d.children) f.push(...u(h));
                  return f;
                };
                return so(u(l.targetSnapshot.root)).pipe(Ot(), me(1));
              }),
              Ml(() => this.afterPreactivation()),
              xe(() => {
                let { currentSnapshot: l, targetSnapshot: u } = s,
                  d = this.createViewTransition?.(this.environmentInjector, l.root, u.root);
                return d ? ne(d).pipe(V(() => s)) : I(s);
              }),
              V((l) => {
                let u = pb(n.routeReuseStrategy, l.targetSnapshot, l.currentRouterState);
                return (
                  (this.currentTransition = s = G(m({}, l), { targetRouterState: u })), (this.currentNavigation.targetRouterState = u), s
                );
              }),
              ue(() => {
                this.events.next(new gi());
              }),
              Cb(this.rootContexts, n.routeReuseStrategy, (l) => this.events.next(l), this.inputBindingEnabled),
              me(1),
              ue({
                next: (l) => {
                  (a = !0),
                    (this.lastSuccessfulNavigation = this.currentNavigation),
                    this.events.next(
                      new dn(l.id, this.urlSerializer.serialize(l.extractedUrl), this.urlSerializer.serialize(l.urlAfterRedirects)),
                    ),
                    this.titleStrategy?.updateTitle(l.targetRouterState.snapshot),
                    l.resolve(!0);
                },
                complete: () => {
                  a = !0;
                },
              }),
              nt(
                this.transitionAbortSubject.pipe(
                  ue((l) => {
                    throw l;
                  }),
                ),
              ),
              Or(() => {
                if (!a && !c) {
                  let l = '';
                  this.cancelNavigationTransition(s, l, 1);
                }
                this.currentNavigation?.id === s.id && (this.currentNavigation = null);
              }),
              Tt((l) => {
                if (((c = !0), ng(l)))
                  this.events.next(new Bt(s.id, this.urlSerializer.serialize(s.extractedUrl), l.message, l.cancellationCode)),
                    vb(l) ? this.events.next(new mi(l.url)) : s.resolve(!1);
                else {
                  this.events.next(new pi(s.id, this.urlSerializer.serialize(s.extractedUrl), l, s.targetSnapshot ?? void 0));
                  try {
                    s.resolve(n.errorHandler(l));
                  } catch (u) {
                    s.reject(u);
                  }
                }
                return Me;
              }),
            );
          }),
        )
      );
    }
    cancelNavigationTransition(n, i, o) {
      let s = new Bt(n.id, this.urlSerializer.serialize(n.extractedUrl), i, o);
      this.events.next(s), n.resolve(!1);
    }
    isUpdatingInternalState() {
      return this.currentTransition?.extractedUrl.toString() !== this.currentTransition?.currentUrlTree.toString();
    }
    isUpdatedBrowserUrl() {
      return (
        this.urlHandlingStrategy.extract(this.urlSerializer.parse(this.location.path(!0))).toString() !==
          this.currentTransition?.extractedUrl.toString() && !this.currentTransition?.extras.skipLocationChange
      );
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function gE(t) {
  return t !== ui;
}
var mE = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(vE))(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Xl = class {
    shouldDetach(e) {
      return !1;
    }
    store(e, r) {}
    shouldAttach(e) {
      return !1;
    }
    retrieve(e) {
      return null;
    }
    shouldReuseRoute(e, r) {
      return e.routeConfig === r.routeConfig;
    }
  },
  vE = (() => {
    let e = class e extends Xl {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = er(e)))(o || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  lg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: () => (() => _(yE))(), providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  yE = (() => {
    let e = class e extends lg {
      constructor() {
        super(...arguments),
          (this.location = _(cn)),
          (this.urlSerializer = _(Jl)),
          (this.options = _(ou, { optional: !0 }) || {}),
          (this.canceledNavigationResolution = this.options.canceledNavigationResolution || 'replace'),
          (this.urlHandlingStrategy = _(au)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.currentUrlTree = new jt()),
          (this.rawUrlTree = this.currentUrlTree),
          (this.currentPageId = 0),
          (this.lastSuccessfulId = -1),
          (this.routerState = Kp(this.currentUrlTree, null)),
          (this.stateMemento = this.createStateMemento());
      }
      getCurrentUrlTree() {
        return this.currentUrlTree;
      }
      getRawUrlTree() {
        return this.rawUrlTree;
      }
      restoredState() {
        return this.location.getState();
      }
      get browserPageId() {
        return this.canceledNavigationResolution !== 'computed'
          ? this.currentPageId
          : this.restoredState()?.ɵrouterPageId ?? this.currentPageId;
      }
      getRouterState() {
        return this.routerState;
      }
      createStateMemento() {
        return { rawUrlTree: this.rawUrlTree, currentUrlTree: this.currentUrlTree, routerState: this.routerState };
      }
      registerNonRouterCurrentEntryChangeListener(n) {
        return this.location.subscribe((i) => {
          i.type === 'popstate' && n(i.url, i.state);
        });
      }
      handleRouterEvent(n, i) {
        if (n instanceof hi) this.stateMemento = this.createStateMemento();
        else if (n instanceof fn) this.rawUrlTree = i.initialUrl;
        else if (n instanceof ys) {
          if (this.urlUpdateStrategy === 'eager' && !i.extras.skipLocationChange) {
            let o = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl);
            this.setBrowserUrl(o, i);
          }
        } else
          n instanceof gi
            ? ((this.currentUrlTree = i.finalUrl),
              (this.rawUrlTree = this.urlHandlingStrategy.merge(i.finalUrl, i.initialUrl)),
              (this.routerState = i.targetRouterState),
              this.urlUpdateStrategy === 'deferred' && (i.extras.skipLocationChange || this.setBrowserUrl(this.rawUrlTree, i)))
            : n instanceof Bt && (n.code === 3 || n.code === 2)
              ? this.restoreHistory(i)
              : n instanceof pi
                ? this.restoreHistory(i, !0)
                : n instanceof dn && ((this.lastSuccessfulId = n.id), (this.currentPageId = this.browserPageId));
      }
      setBrowserUrl(n, i) {
        let o = this.urlSerializer.serialize(n);
        if (this.location.isCurrentPathEqualTo(o) || i.extras.replaceUrl) {
          let s = this.browserPageId,
            a = m(m({}, i.extras.state), this.generateNgRouterState(i.id, s));
          this.location.replaceState(o, '', a);
        } else {
          let s = m(m({}, i.extras.state), this.generateNgRouterState(i.id, this.browserPageId + 1));
          this.location.go(o, '', s);
        }
      }
      restoreHistory(n, i = !1) {
        if (this.canceledNavigationResolution === 'computed') {
          let o = this.browserPageId,
            s = this.currentPageId - o;
          s !== 0
            ? this.location.historyGo(s)
            : this.currentUrlTree === n.finalUrl && s === 0 && (this.resetState(n), this.resetUrlToCurrentUrlTree());
        } else this.canceledNavigationResolution === 'replace' && (i && this.resetState(n), this.resetUrlToCurrentUrlTree());
      }
      resetState(n) {
        (this.routerState = this.stateMemento.routerState),
          (this.currentUrlTree = this.stateMemento.currentUrlTree),
          (this.rawUrlTree = this.urlHandlingStrategy.merge(this.currentUrlTree, n.finalUrl ?? this.rawUrlTree));
      }
      resetUrlToCurrentUrlTree() {
        this.location.replaceState(
          this.urlSerializer.serialize(this.rawUrlTree),
          '',
          this.generateNgRouterState(this.lastSuccessfulId, this.currentPageId),
        );
      }
      generateNgRouterState(n, i) {
        return this.canceledNavigationResolution === 'computed' ? { navigationId: n, ɵrouterPageId: i } : { navigationId: n };
      }
    };
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = er(e)))(o || e);
      };
    })()),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  ci = (function (t) {
    return (t[(t.COMPLETE = 0)] = 'COMPLETE'), (t[(t.FAILED = 1)] = 'FAILED'), (t[(t.REDIRECTING = 2)] = 'REDIRECTING'), t;
  })(ci || {});
function _E(t, e) {
  t.events
    .pipe(
      fe((r) => r instanceof dn || r instanceof Bt || r instanceof pi || r instanceof fn),
      V((r) =>
        r instanceof dn || r instanceof fn
          ? ci.COMPLETE
          : (r instanceof Bt ? r.code === 0 || r.code === 1 : !1)
            ? ci.REDIRECTING
            : ci.FAILED,
      ),
      fe((r) => r !== ci.REDIRECTING),
      me(1),
    )
    .subscribe(() => {
      e();
    });
}
function DE(t) {
  throw t;
}
var CE = { paths: 'exact', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'exact' },
  wE = { paths: 'subset', fragment: 'ignored', matrixParams: 'ignored', queryParams: 'subset' },
  ug = (() => {
    let e = class e {
      get currentUrlTree() {
        return this.stateManager.getCurrentUrlTree();
      }
      get rawUrlTree() {
        return this.stateManager.getRawUrlTree();
      }
      get events() {
        return this._events;
      }
      get routerState() {
        return this.stateManager.getRouterState();
      }
      constructor() {
        (this.disposed = !1),
          (this.isNgZoneEnabled = !1),
          (this.console = _(rs)),
          (this.stateManager = _(lg)),
          (this.options = _(ou, { optional: !0 }) || {}),
          (this.pendingTasks = _(cl)),
          (this.urlUpdateStrategy = this.options.urlUpdateStrategy || 'deferred'),
          (this.navigationTransitions = _(pE)),
          (this.urlSerializer = _(Jl)),
          (this.location = _(cn)),
          (this.urlHandlingStrategy = _(au)),
          (this._events = new $()),
          (this.errorHandler = this.options.errorHandler || DE),
          (this.navigated = !1),
          (this.routeReuseStrategy = _(mE)),
          (this.onSameUrlNavigation = this.options.onSameUrlNavigation || 'ignore'),
          (this.config = _(su, { optional: !0 })?.flat() ?? []),
          (this.componentInputBindingEnabled = !!_(nu, { optional: !0 })),
          (this.eventsSubscription = new q()),
          (this.isNgZoneEnabled = _(j) instanceof j && j.isInAngularZone()),
          this.resetConfig(this.config),
          this.navigationTransitions.setupNavigations(this, this.currentUrlTree, this.routerState).subscribe({
            error: (n) => {
              this.console.warn(n);
            },
          }),
          this.subscribeToNavigationEvents();
      }
      subscribeToNavigationEvents() {
        let n = this.navigationTransitions.events.subscribe((i) => {
          try {
            let o = this.navigationTransitions.currentTransition,
              s = this.navigationTransitions.currentNavigation;
            if (o !== null && s !== null) {
              if ((this.stateManager.handleRouterEvent(i, s), i instanceof Bt && i.code !== 0 && i.code !== 1)) this.navigated = !0;
              else if (i instanceof dn) this.navigated = !0;
              else if (i instanceof mi) {
                let a = this.urlHandlingStrategy.merge(i.url, o.currentRawUrl),
                  c = { skipLocationChange: o.extras.skipLocationChange, replaceUrl: this.urlUpdateStrategy === 'eager' || gE(o.source) };
                this.scheduleNavigation(a, ui, null, c, { resolve: o.resolve, reject: o.reject, promise: o.promise });
              }
            }
            EE(i) && this._events.next(i);
          } catch (o) {
            this.navigationTransitions.transitionAbortSubject.next(o);
          }
        });
        this.eventsSubscription.add(n);
      }
      resetRootComponentType(n) {
        (this.routerState.root.component = n), (this.navigationTransitions.rootComponentType = n);
      }
      initialNavigation() {
        this.setUpLocationChangeListener(),
          this.navigationTransitions.hasRequestedNavigation ||
            this.navigateToSyncWithBrowser(this.location.path(!0), ui, this.stateManager.restoredState());
      }
      setUpLocationChangeListener() {
        this.nonRouterCurrentEntryChangeSubscription ||
          (this.nonRouterCurrentEntryChangeSubscription = this.stateManager.registerNonRouterCurrentEntryChangeListener((n, i) => {
            setTimeout(() => {
              this.navigateToSyncWithBrowser(n, 'popstate', i);
            }, 0);
          }));
      }
      navigateToSyncWithBrowser(n, i, o) {
        let s = { replaceUrl: !0 },
          a = o?.navigationId ? o : null;
        if (o) {
          let l = m({}, o);
          delete l.navigationId, delete l.ɵrouterPageId, Object.keys(l).length !== 0 && (s.state = l);
        }
        let c = this.parseUrl(n);
        this.scheduleNavigation(c, i, a, s);
      }
      get url() {
        return this.serializeUrl(this.currentUrlTree);
      }
      getCurrentNavigation() {
        return this.navigationTransitions.currentNavigation;
      }
      get lastSuccessfulNavigation() {
        return this.navigationTransitions.lastSuccessfulNavigation;
      }
      resetConfig(n) {
        (this.config = n.map(ru)), (this.navigated = !1);
      }
      ngOnDestroy() {
        this.dispose();
      }
      dispose() {
        this.navigationTransitions.complete(),
          this.nonRouterCurrentEntryChangeSubscription &&
            (this.nonRouterCurrentEntryChangeSubscription.unsubscribe(), (this.nonRouterCurrentEntryChangeSubscription = void 0)),
          (this.disposed = !0),
          this.eventsSubscription.unsubscribe();
      }
      createUrlTree(n, i = {}) {
        let { relativeTo: o, queryParams: s, fragment: a, queryParamsHandling: c, preserveFragment: l } = i,
          u = l ? this.currentUrlTree.fragment : a,
          d = null;
        switch (c) {
          case 'merge':
            d = m(m({}, this.currentUrlTree.queryParams), s);
            break;
          case 'preserve':
            d = this.currentUrlTree.queryParams;
            break;
          default:
            d = s || null;
        }
        d !== null && (d = this.removeEmptyProps(d));
        let f;
        try {
          let h = o ? o.snapshot : this.routerState.snapshot.root;
          f = Gp(h);
        } catch {
          (typeof n[0] != 'string' || !n[0].startsWith('/')) && (n = []), (f = this.currentUrlTree.root);
        }
        return qp(f, n, d, u ?? null);
      }
      navigateByUrl(n, i = { skipLocationChange: !1 }) {
        let o = pr(n) ? n : this.parseUrl(n),
          s = this.urlHandlingStrategy.merge(o, this.rawUrlTree);
        return this.scheduleNavigation(s, ui, null, i);
      }
      navigate(n, i = { skipLocationChange: !1 }) {
        return bE(n), this.navigateByUrl(this.createUrlTree(n, i), i);
      }
      serializeUrl(n) {
        return this.urlSerializer.serialize(n);
      }
      parseUrl(n) {
        try {
          return this.urlSerializer.parse(n);
        } catch {
          return this.urlSerializer.parse('/');
        }
      }
      isActive(n, i) {
        let o;
        if ((i === !0 ? (o = m({}, CE)) : i === !1 ? (o = m({}, wE)) : (o = i), pr(n))) return Tp(this.currentUrlTree, n, o);
        let s = this.parseUrl(n);
        return Tp(this.currentUrlTree, s, o);
      }
      removeEmptyProps(n) {
        return Object.keys(n).reduce((i, o) => {
          let s = n[o];
          return s != null && (i[o] = s), i;
        }, {});
      }
      scheduleNavigation(n, i, o, s, a) {
        if (this.disposed) return Promise.resolve(!1);
        let c, l, u;
        a
          ? ((c = a.resolve), (l = a.reject), (u = a.promise))
          : (u = new Promise((f, h) => {
              (c = f), (l = h);
            }));
        let d = this.pendingTasks.add();
        return (
          _E(this, () => {
            queueMicrotask(() => this.pendingTasks.remove(d));
          }),
          this.navigationTransitions.handleNavigationRequest({
            source: i,
            restoredState: o,
            currentUrlTree: this.currentUrlTree,
            currentRawUrl: this.currentUrlTree,
            rawUrl: n,
            extras: s,
            resolve: c,
            reject: l,
            promise: u,
            currentSnapshot: this.routerState.snapshot,
            currentRouterState: this.routerState,
          }),
          u.catch((f) => Promise.reject(f))
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function bE(t) {
  for (let e = 0; e < t.length; e++) if (t[e] == null) throw new M(4008, !1);
}
function EE(t) {
  return !(t instanceof gi) && !(t instanceof mi);
}
var IE = new b('');
function dg(t, ...e) {
  return Go([
    { provide: su, multi: !0, useValue: t },
    [],
    { provide: gr, useFactory: ME, deps: [ug] },
    { provide: ul, multi: !0, useFactory: SE },
    e.map((r) => r.ɵproviders),
  ]);
}
function ME(t) {
  return t.routerState.root;
}
function SE() {
  let t = _(ge);
  return (e) => {
    let r = t.get(sn);
    if (e !== r.components[0]) return;
    let n = t.get(ug),
      i = t.get(xE);
    t.get(AE) === 1 && n.initialNavigation(),
      t.get(TE, null, L.Optional)?.setUpPreloading(),
      t.get(IE, null, L.Optional)?.init(),
      n.resetRootComponentType(r.componentTypes[0]),
      i.closed || (i.next(), i.complete(), i.unsubscribe());
  };
}
var xE = new b('', { factory: () => new $() }),
  AE = new b('', { providedIn: 'root', factory: () => 1 });
var TE = new b('');
var fg = [];
var hg = { providers: [dg(fg)] };
var pg = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-header']],
      standalone: !0,
      features: [Q],
      decls: 5,
      vars: 0,
      consts: [
        [1, 'container'],
        [1, 'icon-fighter-jet'],
      ],
      template: function (i, o) {
        i & 1 && (C(0, 'header')(1, 'div', 0)(2, 'a'), we(3, 'i', 1), S(4, ' Archangel-12 '), D()()());
      },
      styles: [
        'header[_ngcontent-%COMP%]{background-color:var(--background-color);width:100%;height:60px;line-height:60px;margin-bottom:20px}',
      ],
    }));
  let t = e;
  return t;
})();
var gg = (() => {
  let e = class e {
    constructor() {
      this.size = 16;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['archangel-loader']],
      inputs: { size: 'size' },
      standalone: !0,
      features: [Q],
      decls: 1,
      vars: 4,
      consts: [[1, 'loader']],
      template: function (i, o) {
        i & 1 && we(0, 'span', 0), i & 2 && Jr('width', o.size, 'px')('height', o.size, 'px');
      },
      styles: [
        '.loader[_ngcontent-%COMP%]{width:16px;height:16px;border:3px solid var(--white-color);border-bottom-color:transparent;border-radius:50%;display:inline-block;box-sizing:border-box;animation:_ngcontent-%COMP%_rotation 1s linear infinite;transition:all .75s ease-in-out}.loader.loader-button-edition[_ngcontent-%COMP%]{opacity:0}.loader.loader-primary[_ngcontent-%COMP%]{border-color:var(--primary-button-text-color);border-bottom-color:transparent}.loader.loader-secondary[_ngcontent-%COMP%]{border-color:var(--secondary-button-text-color);border-bottom-color:transparent}.loader.loader-black[_ngcontent-%COMP%]{border-color:var(--black-button-text-color);border-bottom-color:transparent}.loader.loader-white[_ngcontent-%COMP%]{border-color:var(--white-button-text-color);border-bottom-color:transparent}.loader.loader-faded-in[_ngcontent-%COMP%]{opacity:1}@keyframes _ngcontent-%COMP%_rotation{0%{transform:rotate(0)}to{transform:rotate(360deg)}}',
      ],
    }));
  let t = e;
  return t;
})();
var ft = (() => {
  let e = class e {
    set disabled(n) {
      this.isDisabled = n;
    }
    get classes() {
      let n = ['btn'];
      return (
        this.small && n.push('btn-small'),
        this.border && n.push('btn-bordered'),
        this.rounded && n.push('btn-rounded'),
        this.fullWidth && n.push('btn-full-width'),
        this.color && n.push(`btn-${this.color}`),
        n.join(' ')
      );
    }
    constructor(n, i, o) {
      (this.el = n),
        (this.vcr = i),
        (this.platformId = o),
        (this.small = !1),
        (this.border = !1),
        (this.rounded = !1),
        (this.fullWidth = !1),
        (this.loading = !1),
        (this.isDisabled = !1),
        (this.initialWidth = 0),
        (this.initialHeight = 0),
        (this.loaderSize = 11),
        (this.loaderGap = 10),
        (this.hasAddedLoader = !1),
        (this.isBrowser = !1),
        (this.isBrowser = cr(o));
    }
    ngOnChanges(n) {
      let i = n.loading && n.loading.currentValue;
      this.isBrowser && i && !this.hasAddedLoader
        ? this.beginLoadingSequence()
        : this.isBrowser && !i && this.hasAddedLoader && this.finalizeLoadingSequence();
    }
    beginLoadingSequence() {
      let n = this.el.nativeElement;
      (this.initialWidth = n.offsetWidth),
        (this.initialHeight = n.offsetHeight),
        (n.style.width = this.initialWidth + 'px'),
        (n.style.height = this.initialHeight + 'px'),
        setTimeout(() => {
          n.style.width = this.initialWidth + this.loaderSize + this.loaderGap + 'px';
          let i = document.createElement('span');
          i.textContent = n.innerText;
          let o = this.initialWidth / 2 + i.offsetWidth / 2;
          n.offsetWidth > this.initialWidth
            ? (o = o - this.loaderSize - this.loaderGap)
            : (o = o - this.loaderSize * 2 - this.loaderGap - 7);
          let s = document.querySelector(':root'),
            a = s ? getComputedStyle(s) : !1,
            c = a ? a.getPropertyValue('--button-border-width') : '0px',
            l = Number(c.slice(0, -2));
          (i.style.left = o - l + 'px'),
            (n.innerText = ''),
            n.appendChild(i),
            setTimeout(() => {
              let u = this.initialWidth / 2 - i.offsetWidth / 2;
              n.offsetWidth > this.initialWidth
                ? (u = u + this.loaderGap + this.loaderSize)
                : (u = u + this.loaderGap / 2 + this.loaderSize / 2),
                (i.style.left = u + 'px'),
                setTimeout(() => {
                  let d = this.vcr.createComponent(gg);
                  (d.instance.size = this.loaderSize), n.insertBefore(d.location.nativeElement, n.firstChild);
                  let f = d.location.nativeElement.querySelector('.loader');
                  (f.style.left = '0px'),
                    f.classList.add('loader-button-edition'),
                    f.classList.add(`loader-${this.color}`),
                    setTimeout(() => {
                      let h = this.initialWidth / 2 - i.offsetWidth / 2;
                      n.offsetWidth > this.initialWidth && (h = h + this.loaderSize),
                        (d.location.nativeElement.style.position = 'absolute'),
                        (d.location.nativeElement.style.top = '3px'),
                        (d.location.nativeElement.style.left = h - this.loaderGap + 'px'),
                        setTimeout(() => {
                          f.classList.add('loader-faded-in'),
                            setTimeout(() => {
                              this.hasAddedLoader = !0;
                            }, 333);
                        }, 100);
                    }, 0);
                }, 0);
            }, 333);
        }, 100);
    }
    finalizeLoadingSequence() {
      let n = this.el.nativeElement.querySelector('archangel-loader');
      this.el.nativeElement.querySelector('.loader').classList.remove('loader-faded-in'),
        setTimeout(() => {
          this.el.nativeElement.removeChild(n);
          let o = this.el.nativeElement.querySelector('span'),
            s = this.initialWidth / 2 - o.offsetWidth / 2;
          (o.style.left = s + 'px'),
            (this.el.nativeElement.style.width = this.initialWidth + 'px'),
            setTimeout(() => {
              (this.el.nativeElement.innerText = o.innerText),
                setTimeout(() => {
                  this.hasAddedLoader = !1;
                }, 333);
            }, 333);
        }, 333);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(te), v(Fe), v($e));
  }),
    (e.ɵdir = re({
      type: e,
      selectors: [['', 'archangelButton', '']],
      hostVars: 4,
      hostBindings: function (i, o) {
        i & 2 && (Yh(o.classes), Pe('btn-disabled', o.isDisabled));
      },
      inputs: {
        color: 'color',
        small: 'small',
        border: 'border',
        rounded: 'rounded',
        fullWidth: 'fullWidth',
        loading: 'loading',
        disabled: 'disabled',
      },
      standalone: !0,
      features: [ye],
    }));
  let t = e;
  return t;
})();
var Eg = (() => {
    let e = class e {
      constructor(n, i) {
        (this._renderer = n), (this._elementRef = i), (this.onChange = (o) => {}), (this.onTouched = () => {});
      }
      setProperty(n, i) {
        this._renderer.setProperty(this._elementRef.nativeElement, n, i);
      }
      registerOnTouched(n) {
        this.onTouched = n;
      }
      registerOnChange(n) {
        this.onChange = n;
      }
      setDisabledState(n) {
        this.setProperty('disabled', n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(nr), v(te));
    }),
      (e.ɵdir = re({ type: e }));
    let t = e;
    return t;
  })(),
  OE = (() => {
    let e = class e extends Eg {};
    (e.ɵfac = (() => {
      let n;
      return function (o) {
        return (n || (n = er(e)))(o || e);
      };
    })()),
      (e.ɵdir = re({ type: e, features: [Re] }));
    let t = e;
    return t;
  })(),
  Mi = new b('NgValueAccessor');
var RE = { provide: Mi, useExisting: _t(() => Ns), multi: !0 };
function NE() {
  let t = St() ? St().getUserAgent() : '';
  return /android (\d+)/.test(t.toLowerCase());
}
var PE = new b('CompositionEventMode'),
  Ns = (() => {
    let e = class e extends Eg {
      constructor(n, i, o) {
        super(n, i), (this._compositionMode = o), (this._composing = !1), this._compositionMode == null && (this._compositionMode = !NE());
      }
      writeValue(n) {
        let i = n ?? '';
        this.setProperty('value', i);
      }
      _handleInput(n) {
        (!this._compositionMode || (this._compositionMode && !this._composing)) && this.onChange(n);
      }
      _compositionStart() {
        this._composing = !0;
      }
      _compositionEnd(n) {
        (this._composing = !1), this._compositionMode && this.onChange(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(nr), v(te), v(PE, 8));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [
          ['input', 'formControlName', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControlName', ''],
          ['input', 'formControl', '', 3, 'type', 'checkbox'],
          ['textarea', 'formControl', ''],
          ['input', 'ngModel', '', 3, 'type', 'checkbox'],
          ['textarea', 'ngModel', ''],
          ['', 'ngDefaultControl', ''],
        ],
        hostBindings: function (i, o) {
          i & 1 &&
            X('input', function (a) {
              return o._handleInput(a.target.value);
            })('blur', function () {
              return o.onTouched();
            })('compositionstart', function () {
              return o._compositionStart();
            })('compositionend', function (a) {
              return o._compositionEnd(a.target.value);
            });
        },
        features: [Ne([RE]), Re],
      }));
    let t = e;
    return t;
  })();
var fu = new b('NgValidators'),
  hu = new b('NgAsyncValidators');
function Ig(t) {
  return t != null;
}
function Mg(t) {
  return on(t) ? ne(t) : t;
}
function Sg(t) {
  let e = {};
  return (
    t.forEach((r) => {
      e = r != null ? m(m({}, e), r) : e;
    }),
    Object.keys(e).length === 0 ? null : e
  );
}
function xg(t, e) {
  return e.map((r) => r(t));
}
function FE(t) {
  return !t.validate;
}
function Ag(t) {
  return t.map((e) => (FE(e) ? e : (r) => e.validate(r)));
}
function kE(t) {
  if (!t) return null;
  let e = t.filter(Ig);
  return e.length == 0
    ? null
    : function (r) {
        return Sg(xg(r, e));
      };
}
function Tg(t) {
  return t != null ? kE(Ag(t)) : null;
}
function LE(t) {
  if (!t) return null;
  let e = t.filter(Ig);
  return e.length == 0
    ? null
    : function (r) {
        let n = xg(r, e).map(Mg);
        return ha(n).pipe(V(Sg));
      };
}
function Og(t) {
  return t != null ? LE(Ag(t)) : null;
}
function mg(t, e) {
  return t === null ? [e] : Array.isArray(t) ? [...t, e] : [t, e];
}
function Rg(t) {
  return t._rawValidators;
}
function Ng(t) {
  return t._rawAsyncValidators;
}
function cu(t) {
  return t ? (Array.isArray(t) ? t : [t]) : [];
}
function Ss(t, e) {
  return Array.isArray(t) ? t.includes(e) : t === e;
}
function vg(t, e) {
  let r = cu(e);
  return (
    cu(t).forEach((i) => {
      Ss(r, i) || r.push(i);
    }),
    r
  );
}
function yg(t, e) {
  return cu(e).filter((r) => !Ss(t, r));
}
var xs = class {
    constructor() {
      (this._rawValidators = []), (this._rawAsyncValidators = []), (this._onDestroyCallbacks = []);
    }
    get value() {
      return this.control ? this.control.value : null;
    }
    get valid() {
      return this.control ? this.control.valid : null;
    }
    get invalid() {
      return this.control ? this.control.invalid : null;
    }
    get pending() {
      return this.control ? this.control.pending : null;
    }
    get disabled() {
      return this.control ? this.control.disabled : null;
    }
    get enabled() {
      return this.control ? this.control.enabled : null;
    }
    get errors() {
      return this.control ? this.control.errors : null;
    }
    get pristine() {
      return this.control ? this.control.pristine : null;
    }
    get dirty() {
      return this.control ? this.control.dirty : null;
    }
    get touched() {
      return this.control ? this.control.touched : null;
    }
    get status() {
      return this.control ? this.control.status : null;
    }
    get untouched() {
      return this.control ? this.control.untouched : null;
    }
    get statusChanges() {
      return this.control ? this.control.statusChanges : null;
    }
    get valueChanges() {
      return this.control ? this.control.valueChanges : null;
    }
    get path() {
      return null;
    }
    _setValidators(e) {
      (this._rawValidators = e || []), (this._composedValidatorFn = Tg(this._rawValidators));
    }
    _setAsyncValidators(e) {
      (this._rawAsyncValidators = e || []), (this._composedAsyncValidatorFn = Og(this._rawAsyncValidators));
    }
    get validator() {
      return this._composedValidatorFn || null;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn || null;
    }
    _registerOnDestroy(e) {
      this._onDestroyCallbacks.push(e);
    }
    _invokeOnDestroyCallbacks() {
      this._onDestroyCallbacks.forEach((e) => e()), (this._onDestroyCallbacks = []);
    }
    reset(e = void 0) {
      this.control && this.control.reset(e);
    }
    hasError(e, r) {
      return this.control ? this.control.hasError(e, r) : !1;
    }
    getError(e, r) {
      return this.control ? this.control.getError(e, r) : null;
    }
  },
  hn = class extends xs {
    get formDirective() {
      return null;
    }
    get path() {
      return null;
    }
  },
  pn = class extends xs {
    constructor() {
      super(...arguments), (this._parent = null), (this.name = null), (this.valueAccessor = null);
    }
  },
  As = class {
    constructor(e) {
      this._cd = e;
    }
    get isTouched() {
      return !!this._cd?.control?.touched;
    }
    get isUntouched() {
      return !!this._cd?.control?.untouched;
    }
    get isPristine() {
      return !!this._cd?.control?.pristine;
    }
    get isDirty() {
      return !!this._cd?.control?.dirty;
    }
    get isValid() {
      return !!this._cd?.control?.valid;
    }
    get isInvalid() {
      return !!this._cd?.control?.invalid;
    }
    get isPending() {
      return !!this._cd?.control?.pending;
    }
    get isSubmitted() {
      return !!this._cd?.submitted;
    }
  },
  VE = {
    '[class.ng-untouched]': 'isUntouched',
    '[class.ng-touched]': 'isTouched',
    '[class.ng-pristine]': 'isPristine',
    '[class.ng-dirty]': 'isDirty',
    '[class.ng-valid]': 'isValid',
    '[class.ng-invalid]': 'isInvalid',
    '[class.ng-pending]': 'isPending',
  },
  fP = G(m({}, VE), { '[class.ng-submitted]': 'isSubmitted' }),
  Ps = (() => {
    let e = class e extends As {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(pn, 2));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [
          ['', 'formControlName', ''],
          ['', 'ngModel', ''],
          ['', 'formControl', ''],
        ],
        hostVars: 14,
        hostBindings: function (i, o) {
          i & 2 &&
            Pe('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)('ng-pristine', o.isPristine)('ng-dirty', o.isDirty)(
              'ng-valid',
              o.isValid,
            )('ng-invalid', o.isInvalid)('ng-pending', o.isPending);
        },
        features: [Re],
      }));
    let t = e;
    return t;
  })(),
  Pg = (() => {
    let e = class e extends As {
      constructor(n) {
        super(n);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(hn, 10));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [
          ['', 'formGroupName', ''],
          ['', 'formArrayName', ''],
          ['', 'ngModelGroup', ''],
          ['', 'formGroup', ''],
          ['form', 3, 'ngNoForm', ''],
          ['', 'ngForm', ''],
        ],
        hostVars: 16,
        hostBindings: function (i, o) {
          i & 2 &&
            Pe('ng-untouched', o.isUntouched)('ng-touched', o.isTouched)('ng-pristine', o.isPristine)('ng-dirty', o.isDirty)(
              'ng-valid',
              o.isValid,
            )('ng-invalid', o.isInvalid)('ng-pending', o.isPending)('ng-submitted', o.isSubmitted);
        },
        features: [Re],
      }));
    let t = e;
    return t;
  })();
var bi = 'VALID',
  Ms = 'INVALID',
  yr = 'PENDING',
  Ei = 'DISABLED';
function pu(t) {
  return (Fs(t) ? t.validators : t) || null;
}
function jE(t) {
  return Array.isArray(t) ? Tg(t) : t || null;
}
function gu(t, e) {
  return (Fs(e) ? e.asyncValidators : t) || null;
}
function BE(t) {
  return Array.isArray(t) ? Og(t) : t || null;
}
function Fs(t) {
  return t != null && !Array.isArray(t) && typeof t == 'object';
}
function Fg(t, e, r) {
  let n = t.controls;
  if (!(e ? Object.keys(n) : n).length) throw new M(1e3, '');
  if (!n[r]) throw new M(1001, '');
}
function kg(t, e, r) {
  t._forEachChild((n, i) => {
    if (r[i] === void 0) throw new M(1002, '');
  });
}
var _r = class {
    constructor(e, r) {
      (this._pendingDirty = !1),
        (this._hasOwnPendingAsyncValidator = !1),
        (this._pendingTouched = !1),
        (this._onCollectionChange = () => {}),
        (this._parent = null),
        (this.pristine = !0),
        (this.touched = !1),
        (this._onDisabledChange = []),
        this._assignValidators(e),
        this._assignAsyncValidators(r);
    }
    get validator() {
      return this._composedValidatorFn;
    }
    set validator(e) {
      this._rawValidators = this._composedValidatorFn = e;
    }
    get asyncValidator() {
      return this._composedAsyncValidatorFn;
    }
    set asyncValidator(e) {
      this._rawAsyncValidators = this._composedAsyncValidatorFn = e;
    }
    get parent() {
      return this._parent;
    }
    get valid() {
      return this.status === bi;
    }
    get invalid() {
      return this.status === Ms;
    }
    get pending() {
      return this.status == yr;
    }
    get disabled() {
      return this.status === Ei;
    }
    get enabled() {
      return this.status !== Ei;
    }
    get dirty() {
      return !this.pristine;
    }
    get untouched() {
      return !this.touched;
    }
    get updateOn() {
      return this._updateOn ? this._updateOn : this.parent ? this.parent.updateOn : 'change';
    }
    setValidators(e) {
      this._assignValidators(e);
    }
    setAsyncValidators(e) {
      this._assignAsyncValidators(e);
    }
    addValidators(e) {
      this.setValidators(vg(e, this._rawValidators));
    }
    addAsyncValidators(e) {
      this.setAsyncValidators(vg(e, this._rawAsyncValidators));
    }
    removeValidators(e) {
      this.setValidators(yg(e, this._rawValidators));
    }
    removeAsyncValidators(e) {
      this.setAsyncValidators(yg(e, this._rawAsyncValidators));
    }
    hasValidator(e) {
      return Ss(this._rawValidators, e);
    }
    hasAsyncValidator(e) {
      return Ss(this._rawAsyncValidators, e);
    }
    clearValidators() {
      this.validator = null;
    }
    clearAsyncValidators() {
      this.asyncValidator = null;
    }
    markAsTouched(e = {}) {
      (this.touched = !0), this._parent && !e.onlySelf && this._parent.markAsTouched(e);
    }
    markAllAsTouched() {
      this.markAsTouched({ onlySelf: !0 }), this._forEachChild((e) => e.markAllAsTouched());
    }
    markAsUntouched(e = {}) {
      (this.touched = !1),
        (this._pendingTouched = !1),
        this._forEachChild((r) => {
          r.markAsUntouched({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    markAsDirty(e = {}) {
      (this.pristine = !1), this._parent && !e.onlySelf && this._parent.markAsDirty(e);
    }
    markAsPristine(e = {}) {
      (this.pristine = !0),
        (this._pendingDirty = !1),
        this._forEachChild((r) => {
          r.markAsPristine({ onlySelf: !0 });
        }),
        this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    markAsPending(e = {}) {
      (this.status = yr),
        e.emitEvent !== !1 && this.statusChanges.emit(this.status),
        this._parent && !e.onlySelf && this._parent.markAsPending(e);
    }
    disable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = Ei),
        (this.errors = null),
        this._forEachChild((n) => {
          n.disable(G(m({}, e), { onlySelf: !0 }));
        }),
        this._updateValue(),
        e.emitEvent !== !1 && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
        this._updateAncestors(G(m({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!0));
    }
    enable(e = {}) {
      let r = this._parentMarkedDirty(e.onlySelf);
      (this.status = bi),
        this._forEachChild((n) => {
          n.enable(G(m({}, e), { onlySelf: !0 }));
        }),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent }),
        this._updateAncestors(G(m({}, e), { skipPristineCheck: r })),
        this._onDisabledChange.forEach((n) => n(!1));
    }
    _updateAncestors(e) {
      this._parent &&
        !e.onlySelf &&
        (this._parent.updateValueAndValidity(e), e.skipPristineCheck || this._parent._updatePristine(), this._parent._updateTouched());
    }
    setParent(e) {
      this._parent = e;
    }
    getRawValue() {
      return this.value;
    }
    updateValueAndValidity(e = {}) {
      this._setInitialStatus(),
        this._updateValue(),
        this.enabled &&
          (this._cancelExistingSubscription(),
          (this.errors = this._runValidator()),
          (this.status = this._calculateStatus()),
          (this.status === bi || this.status === yr) && this._runAsyncValidator(e.emitEvent)),
        e.emitEvent !== !1 && (this.valueChanges.emit(this.value), this.statusChanges.emit(this.status)),
        this._parent && !e.onlySelf && this._parent.updateValueAndValidity(e);
    }
    _updateTreeValidity(e = { emitEvent: !0 }) {
      this._forEachChild((r) => r._updateTreeValidity(e)), this.updateValueAndValidity({ onlySelf: !0, emitEvent: e.emitEvent });
    }
    _setInitialStatus() {
      this.status = this._allControlsDisabled() ? Ei : bi;
    }
    _runValidator() {
      return this.validator ? this.validator(this) : null;
    }
    _runAsyncValidator(e) {
      if (this.asyncValidator) {
        (this.status = yr), (this._hasOwnPendingAsyncValidator = !0);
        let r = Mg(this.asyncValidator(this));
        this._asyncValidationSubscription = r.subscribe((n) => {
          (this._hasOwnPendingAsyncValidator = !1), this.setErrors(n, { emitEvent: e });
        });
      }
    }
    _cancelExistingSubscription() {
      this._asyncValidationSubscription && (this._asyncValidationSubscription.unsubscribe(), (this._hasOwnPendingAsyncValidator = !1));
    }
    setErrors(e, r = {}) {
      (this.errors = e), this._updateControlsErrors(r.emitEvent !== !1);
    }
    get(e) {
      let r = e;
      return r == null || (Array.isArray(r) || (r = r.split('.')), r.length === 0) ? null : r.reduce((n, i) => n && n._find(i), this);
    }
    getError(e, r) {
      let n = r ? this.get(r) : this;
      return n && n.errors ? n.errors[e] : null;
    }
    hasError(e, r) {
      return !!this.getError(e, r);
    }
    get root() {
      let e = this;
      for (; e._parent; ) e = e._parent;
      return e;
    }
    _updateControlsErrors(e) {
      (this.status = this._calculateStatus()),
        e && this.statusChanges.emit(this.status),
        this._parent && this._parent._updateControlsErrors(e);
    }
    _initObservables() {
      (this.valueChanges = new U()), (this.statusChanges = new U());
    }
    _calculateStatus() {
      return this._allControlsDisabled()
        ? Ei
        : this.errors
          ? Ms
          : this._hasOwnPendingAsyncValidator || this._anyControlsHaveStatus(yr)
            ? yr
            : this._anyControlsHaveStatus(Ms)
              ? Ms
              : bi;
    }
    _anyControlsHaveStatus(e) {
      return this._anyControls((r) => r.status === e);
    }
    _anyControlsDirty() {
      return this._anyControls((e) => e.dirty);
    }
    _anyControlsTouched() {
      return this._anyControls((e) => e.touched);
    }
    _updatePristine(e = {}) {
      (this.pristine = !this._anyControlsDirty()), this._parent && !e.onlySelf && this._parent._updatePristine(e);
    }
    _updateTouched(e = {}) {
      (this.touched = this._anyControlsTouched()), this._parent && !e.onlySelf && this._parent._updateTouched(e);
    }
    _registerOnCollectionChange(e) {
      this._onCollectionChange = e;
    }
    _setUpdateStrategy(e) {
      Fs(e) && e.updateOn != null && (this._updateOn = e.updateOn);
    }
    _parentMarkedDirty(e) {
      let r = this._parent && this._parent.dirty;
      return !e && !!r && !this._parent._anyControlsDirty();
    }
    _find(e) {
      return null;
    }
    _assignValidators(e) {
      (this._rawValidators = Array.isArray(e) ? e.slice() : e), (this._composedValidatorFn = jE(this._rawValidators));
    }
    _assignAsyncValidators(e) {
      (this._rawAsyncValidators = Array.isArray(e) ? e.slice() : e), (this._composedAsyncValidatorFn = BE(this._rawAsyncValidators));
    }
  },
  Ts = class extends _r {
    constructor(e, r, n) {
      super(pu(r), gu(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
    }
    registerControl(e, r) {
      return this.controls[e]
        ? this.controls[e]
        : ((this.controls[e] = r), r.setParent(this), r._registerOnCollectionChange(this._onCollectionChange), r);
    }
    addControl(e, r, n = {}) {
      this.registerControl(e, r), this.updateValueAndValidity({ emitEvent: n.emitEvent }), this._onCollectionChange();
    }
    removeControl(e, r = {}) {
      this.controls[e] && this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        this.updateValueAndValidity({ emitEvent: r.emitEvent }),
        this._onCollectionChange();
    }
    setControl(e, r, n = {}) {
      this.controls[e] && this.controls[e]._registerOnCollectionChange(() => {}),
        delete this.controls[e],
        r && this.registerControl(e, r),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    contains(e) {
      return this.controls.hasOwnProperty(e) && this.controls[e].enabled;
    }
    setValue(e, r = {}) {
      kg(this, !0, e),
        Object.keys(e).forEach((n) => {
          Fg(this, !0, n), this.controls[n].setValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (Object.keys(e).forEach((n) => {
          let i = this.controls[n];
          i && i.patchValue(e[n], { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = {}, r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e ? e[i] : null, { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this._reduceChildren({}, (e, r, n) => ((e[n] = r.getRawValue()), e));
    }
    _syncPendingControls() {
      let e = this._reduceChildren(!1, (r, n) => (n._syncPendingControls() ? !0 : r));
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      Object.keys(this.controls).forEach((r) => {
        let n = this.controls[r];
        n && e(n, r);
      });
    }
    _setUpControls() {
      this._forEachChild((e) => {
        e.setParent(this), e._registerOnCollectionChange(this._onCollectionChange);
      });
    }
    _updateValue() {
      this.value = this._reduceValue();
    }
    _anyControls(e) {
      for (let [r, n] of Object.entries(this.controls)) if (this.contains(r) && e(n)) return !0;
      return !1;
    }
    _reduceValue() {
      let e = {};
      return this._reduceChildren(e, (r, n, i) => ((n.enabled || this.disabled) && (r[i] = n.value), r));
    }
    _reduceChildren(e, r) {
      let n = e;
      return (
        this._forEachChild((i, o) => {
          n = r(n, i, o);
        }),
        n
      );
    }
    _allControlsDisabled() {
      for (let e of Object.keys(this.controls)) if (this.controls[e].enabled) return !1;
      return Object.keys(this.controls).length > 0 || this.disabled;
    }
    _find(e) {
      return this.controls.hasOwnProperty(e) ? this.controls[e] : null;
    }
  };
var lu = class extends Ts {};
var ks = new b('CallSetDisabledState', { providedIn: 'root', factory: () => Ls }),
  Ls = 'always';
function Lg(t, e) {
  return [...e.path, t];
}
function uu(t, e, r = Ls) {
  mu(t, e),
    e.valueAccessor.writeValue(t.value),
    (t.disabled || r === 'always') && e.valueAccessor.setDisabledState?.(t.disabled),
    UE(t, e),
    zE(t, e),
    HE(t, e),
    $E(t, e);
}
function _g(t, e, r = !0) {
  let n = () => {};
  e.valueAccessor && (e.valueAccessor.registerOnChange(n), e.valueAccessor.registerOnTouched(n)),
    Rs(t, e),
    t && (e._invokeOnDestroyCallbacks(), t._registerOnCollectionChange(() => {}));
}
function Os(t, e) {
  t.forEach((r) => {
    r.registerOnValidatorChange && r.registerOnValidatorChange(e);
  });
}
function $E(t, e) {
  if (e.valueAccessor.setDisabledState) {
    let r = (n) => {
      e.valueAccessor.setDisabledState(n);
    };
    t.registerOnDisabledChange(r),
      e._registerOnDestroy(() => {
        t._unregisterOnDisabledChange(r);
      });
  }
}
function mu(t, e) {
  let r = Rg(t);
  e.validator !== null ? t.setValidators(mg(r, e.validator)) : typeof r == 'function' && t.setValidators([r]);
  let n = Ng(t);
  e.asyncValidator !== null ? t.setAsyncValidators(mg(n, e.asyncValidator)) : typeof n == 'function' && t.setAsyncValidators([n]);
  let i = () => t.updateValueAndValidity();
  Os(e._rawValidators, i), Os(e._rawAsyncValidators, i);
}
function Rs(t, e) {
  let r = !1;
  if (t !== null) {
    if (e.validator !== null) {
      let i = Rg(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.validator);
        o.length !== i.length && ((r = !0), t.setValidators(o));
      }
    }
    if (e.asyncValidator !== null) {
      let i = Ng(t);
      if (Array.isArray(i) && i.length > 0) {
        let o = i.filter((s) => s !== e.asyncValidator);
        o.length !== i.length && ((r = !0), t.setAsyncValidators(o));
      }
    }
  }
  let n = () => {};
  return Os(e._rawValidators, n), Os(e._rawAsyncValidators, n), r;
}
function UE(t, e) {
  e.valueAccessor.registerOnChange((r) => {
    (t._pendingValue = r), (t._pendingChange = !0), (t._pendingDirty = !0), t.updateOn === 'change' && Vg(t, e);
  });
}
function HE(t, e) {
  e.valueAccessor.registerOnTouched(() => {
    (t._pendingTouched = !0), t.updateOn === 'blur' && t._pendingChange && Vg(t, e), t.updateOn !== 'submit' && t.markAsTouched();
  });
}
function Vg(t, e) {
  t._pendingDirty && t.markAsDirty(),
    t.setValue(t._pendingValue, { emitModelToViewChange: !1 }),
    e.viewToModelUpdate(t._pendingValue),
    (t._pendingChange = !1);
}
function zE(t, e) {
  let r = (n, i) => {
    e.valueAccessor.writeValue(n), i && e.viewToModelUpdate(n);
  };
  t.registerOnChange(r),
    e._registerOnDestroy(() => {
      t._unregisterOnChange(r);
    });
}
function WE(t, e) {
  t == null, mu(t, e);
}
function GE(t, e) {
  return Rs(t, e);
}
function jg(t, e) {
  if (!t.hasOwnProperty('model')) return !1;
  let r = t.model;
  return r.isFirstChange() ? !0 : !Object.is(e, r.currentValue);
}
function qE(t) {
  return Object.getPrototypeOf(t.constructor) === OE;
}
function YE(t, e) {
  t._syncPendingControls(),
    e.forEach((r) => {
      let n = r.control;
      n.updateOn === 'submit' && n._pendingChange && (r.viewToModelUpdate(n._pendingValue), (n._pendingChange = !1));
    });
}
function Bg(t, e) {
  if (!e) return null;
  Array.isArray(e);
  let r, n, i;
  return (
    e.forEach((o) => {
      o.constructor === Ns ? (r = o) : qE(o) ? (n = o) : (i = o);
    }),
    i || n || r || null
  );
}
function ZE(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Dg(t, e) {
  let r = t.indexOf(e);
  r > -1 && t.splice(r, 1);
}
function Cg(t) {
  return typeof t == 'object' && t !== null && Object.keys(t).length === 2 && 'value' in t && 'disabled' in t;
}
var Ii = class extends _r {
  constructor(e = null, r, n) {
    super(pu(r), gu(n, r)),
      (this.defaultValue = null),
      (this._onChange = []),
      (this._pendingChange = !1),
      this._applyFormState(e),
      this._setUpdateStrategy(r),
      this._initObservables(),
      this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator }),
      Fs(r) && (r.nonNullable || r.initialValueIsDefault) && (Cg(e) ? (this.defaultValue = e.value) : (this.defaultValue = e));
  }
  setValue(e, r = {}) {
    (this.value = this._pendingValue = e),
      this._onChange.length &&
        r.emitModelToViewChange !== !1 &&
        this._onChange.forEach((n) => n(this.value, r.emitViewToModelChange !== !1)),
      this.updateValueAndValidity(r);
  }
  patchValue(e, r = {}) {
    this.setValue(e, r);
  }
  reset(e = this.defaultValue, r = {}) {
    this._applyFormState(e), this.markAsPristine(r), this.markAsUntouched(r), this.setValue(this.value, r), (this._pendingChange = !1);
  }
  _updateValue() {}
  _anyControls(e) {
    return !1;
  }
  _allControlsDisabled() {
    return this.disabled;
  }
  registerOnChange(e) {
    this._onChange.push(e);
  }
  _unregisterOnChange(e) {
    Dg(this._onChange, e);
  }
  registerOnDisabledChange(e) {
    this._onDisabledChange.push(e);
  }
  _unregisterOnDisabledChange(e) {
    Dg(this._onDisabledChange, e);
  }
  _forEachChild(e) {}
  _syncPendingControls() {
    return this.updateOn === 'submit' &&
      (this._pendingDirty && this.markAsDirty(), this._pendingTouched && this.markAsTouched(), this._pendingChange)
      ? (this.setValue(this._pendingValue, { onlySelf: !0, emitModelToViewChange: !1 }), !0)
      : !1;
  }
  _applyFormState(e) {
    Cg(e)
      ? ((this.value = this._pendingValue = e.value),
        e.disabled ? this.disable({ onlySelf: !0, emitEvent: !1 }) : this.enable({ onlySelf: !0, emitEvent: !1 }))
      : (this.value = this._pendingValue = e);
  }
};
var KE = (t) => t instanceof Ii;
var QE = { provide: pn, useExisting: _t(() => Si) },
  wg = (() => Promise.resolve())(),
  Si = (() => {
    let e = class e extends pn {
      constructor(n, i, o, s, a, c) {
        super(),
          (this._changeDetectorRef = a),
          (this.callSetDisabledState = c),
          (this.control = new Ii()),
          (this._registered = !1),
          (this.name = ''),
          (this.update = new U()),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = Bg(this, s));
      }
      ngOnChanges(n) {
        if ((this._checkForErrors(), !this._registered || 'name' in n)) {
          if (this._registered && (this._checkName(), this.formDirective)) {
            let i = n.name.previousValue;
            this.formDirective.removeControl({ name: i, path: this._getPath(i) });
          }
          this._setUpControl();
        }
        'isDisabled' in n && this._updateDisabled(n),
          jg(n, this.viewModel) && (this._updateValue(this.model), (this.viewModel = this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      get path() {
        return this._getPath(this.name);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      _setUpControl() {
        this._setUpdateStrategy(),
          this._isStandalone() ? this._setUpStandalone() : this.formDirective.addControl(this),
          (this._registered = !0);
      }
      _setUpdateStrategy() {
        this.options && this.options.updateOn != null && (this.control._updateOn = this.options.updateOn);
      }
      _isStandalone() {
        return !this._parent || !!(this.options && this.options.standalone);
      }
      _setUpStandalone() {
        uu(this.control, this, this.callSetDisabledState), this.control.updateValueAndValidity({ emitEvent: !1 });
      }
      _checkForErrors() {
        this._isStandalone() || this._checkParentType(), this._checkName();
      }
      _checkParentType() {}
      _checkName() {
        this.options && this.options.name && (this.name = this.options.name), !this._isStandalone() && this.name;
      }
      _updateValue(n) {
        wg.then(() => {
          this.control.setValue(n, { emitViewToModelChange: !1 }), this._changeDetectorRef?.markForCheck();
        });
      }
      _updateDisabled(n) {
        let i = n.isDisabled.currentValue,
          o = i !== 0 && Ue(i);
        wg.then(() => {
          o && !this.control.disabled ? this.control.disable() : !o && this.control.disabled && this.control.enable(),
            this._changeDetectorRef?.markForCheck();
        });
      }
      _getPath(n) {
        return this._parent ? Lg(n, this._parent) : [n];
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(hn, 9), v(fu, 10), v(hu, 10), v(Mi, 10), v(wt, 8), v(ks, 8));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [['', 'ngModel', '', 3, 'formControlName', '', 3, 'formControl', '']],
        inputs: {
          name: 'name',
          isDisabled: ['disabled', 'isDisabled'],
          model: ['ngModel', 'model'],
          options: ['ngModelOptions', 'options'],
        },
        outputs: { update: 'ngModelChange' },
        exportAs: ['ngModel'],
        features: [Ne([QE]), Re, ye],
      }));
    let t = e;
    return t;
  })(),
  $g = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵdir = re({ type: e, selectors: [['form', 3, 'ngNoForm', '', 3, 'ngNativeValidate', '']], hostAttrs: ['novalidate', ''] }));
    let t = e;
    return t;
  })();
var XE = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = se({ type: e })),
    (e.ɵinj = oe({}));
  let t = e;
  return t;
})();
var Ug = new b('NgModelWithFormControlWarning');
var JE = { provide: hn, useExisting: _t(() => vu) },
  vu = (() => {
    let e = class e extends hn {
      constructor(n, i, o) {
        super(),
          (this.callSetDisabledState = o),
          (this.submitted = !1),
          (this._onCollectionChange = () => this._updateDomValue()),
          (this.directives = []),
          (this.form = null),
          (this.ngSubmit = new U()),
          this._setValidators(n),
          this._setAsyncValidators(i);
      }
      ngOnChanges(n) {
        this._checkFormPresent(),
          n.hasOwnProperty('form') &&
            (this._updateValidators(), this._updateDomValue(), this._updateRegistrations(), (this._oldForm = this.form));
      }
      ngOnDestroy() {
        this.form &&
          (Rs(this.form, this),
          this.form._onCollectionChange === this._onCollectionChange && this.form._registerOnCollectionChange(() => {}));
      }
      get formDirective() {
        return this;
      }
      get control() {
        return this.form;
      }
      get path() {
        return [];
      }
      addControl(n) {
        let i = this.form.get(n.path);
        return uu(i, n, this.callSetDisabledState), i.updateValueAndValidity({ emitEvent: !1 }), this.directives.push(n), i;
      }
      getControl(n) {
        return this.form.get(n.path);
      }
      removeControl(n) {
        _g(n.control || null, n, !1), ZE(this.directives, n);
      }
      addFormGroup(n) {
        this._setUpFormContainer(n);
      }
      removeFormGroup(n) {
        this._cleanUpFormContainer(n);
      }
      getFormGroup(n) {
        return this.form.get(n.path);
      }
      addFormArray(n) {
        this._setUpFormContainer(n);
      }
      removeFormArray(n) {
        this._cleanUpFormContainer(n);
      }
      getFormArray(n) {
        return this.form.get(n.path);
      }
      updateModel(n, i) {
        this.form.get(n.path).setValue(i);
      }
      onSubmit(n) {
        return (this.submitted = !0), YE(this.form, this.directives), this.ngSubmit.emit(n), n?.target?.method === 'dialog';
      }
      onReset() {
        this.resetForm();
      }
      resetForm(n = void 0) {
        this.form.reset(n), (this.submitted = !1);
      }
      _updateDomValue() {
        this.directives.forEach((n) => {
          let i = n.control,
            o = this.form.get(n.path);
          i !== o && (_g(i || null, n), KE(o) && (uu(o, n, this.callSetDisabledState), (n.control = o)));
        }),
          this.form._updateTreeValidity({ emitEvent: !1 });
      }
      _setUpFormContainer(n) {
        let i = this.form.get(n.path);
        WE(i, n), i.updateValueAndValidity({ emitEvent: !1 });
      }
      _cleanUpFormContainer(n) {
        if (this.form) {
          let i = this.form.get(n.path);
          i && GE(i, n) && i.updateValueAndValidity({ emitEvent: !1 });
        }
      }
      _updateRegistrations() {
        this.form._registerOnCollectionChange(this._onCollectionChange),
          this._oldForm && this._oldForm._registerOnCollectionChange(() => {});
      }
      _updateValidators() {
        mu(this.form, this), this._oldForm && Rs(this._oldForm, this);
      }
      _checkFormPresent() {
        this.form;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(fu, 10), v(hu, 10), v(ks, 8));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [['', 'formGroup', '']],
        hostBindings: function (i, o) {
          i & 1 &&
            X('submit', function (a) {
              return o.onSubmit(a);
            })('reset', function () {
              return o.onReset();
            });
        },
        inputs: { form: ['formGroup', 'form'] },
        outputs: { ngSubmit: 'ngSubmit' },
        exportAs: ['ngForm'],
        features: [Ne([JE]), Re, ye],
      }));
    let t = e;
    return t;
  })();
var e0 = { provide: pn, useExisting: _t(() => yu) },
  yu = (() => {
    let e = class e extends pn {
      set isDisabled(n) {}
      constructor(n, i, o, s, a) {
        super(),
          (this._ngModelWarningConfig = a),
          (this._added = !1),
          (this.name = null),
          (this.update = new U()),
          (this._ngModelWarningSent = !1),
          (this._parent = n),
          this._setValidators(i),
          this._setAsyncValidators(o),
          (this.valueAccessor = Bg(this, s));
      }
      ngOnChanges(n) {
        this._added || this._setUpControl(),
          jg(n, this.viewModel) && ((this.viewModel = this.model), this.formDirective.updateModel(this, this.model));
      }
      ngOnDestroy() {
        this.formDirective && this.formDirective.removeControl(this);
      }
      viewToModelUpdate(n) {
        (this.viewModel = n), this.update.emit(n);
      }
      get path() {
        return Lg(this.name == null ? this.name : this.name.toString(), this._parent);
      }
      get formDirective() {
        return this._parent ? this._parent.formDirective : null;
      }
      _checkParentType() {}
      _setUpControl() {
        this._checkParentType(), (this.control = this.formDirective.addControl(this)), (this._added = !0);
      }
    };
    (e._ngModelWarningSentOnce = !1),
      (e.ɵfac = function (i) {
        return new (i || e)(v(hn, 13), v(fu, 10), v(hu, 10), v(Mi, 10), v(Ug, 8));
      }),
      (e.ɵdir = re({
        type: e,
        selectors: [['', 'formControlName', '']],
        inputs: { name: ['formControlName', 'name'], isDisabled: ['disabled', 'isDisabled'], model: ['ngModel', 'model'] },
        outputs: { update: 'ngModelChange' },
        features: [Ne([e0]), Re, ye],
      }));
    let t = e;
    return t;
  })();
var Hg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({ imports: [XE] }));
    let t = e;
    return t;
  })(),
  du = class extends _r {
    constructor(e, r, n) {
      super(pu(r), gu(n, r)),
        (this.controls = e),
        this._initObservables(),
        this._setUpdateStrategy(r),
        this._setUpControls(),
        this.updateValueAndValidity({ onlySelf: !0, emitEvent: !!this.asyncValidator });
    }
    at(e) {
      return this.controls[this._adjustIndex(e)];
    }
    push(e, r = {}) {
      this.controls.push(e), this._registerControl(e), this.updateValueAndValidity({ emitEvent: r.emitEvent }), this._onCollectionChange();
    }
    insert(e, r, n = {}) {
      this.controls.splice(e, 0, r), this._registerControl(r), this.updateValueAndValidity({ emitEvent: n.emitEvent });
    }
    removeAt(e, r = {}) {
      let n = this._adjustIndex(e);
      n < 0 && (n = 0),
        this.controls[n] && this.controls[n]._registerOnCollectionChange(() => {}),
        this.controls.splice(n, 1),
        this.updateValueAndValidity({ emitEvent: r.emitEvent });
    }
    setControl(e, r, n = {}) {
      let i = this._adjustIndex(e);
      i < 0 && (i = 0),
        this.controls[i] && this.controls[i]._registerOnCollectionChange(() => {}),
        this.controls.splice(i, 1),
        r && (this.controls.splice(i, 0, r), this._registerControl(r)),
        this.updateValueAndValidity({ emitEvent: n.emitEvent }),
        this._onCollectionChange();
    }
    get length() {
      return this.controls.length;
    }
    setValue(e, r = {}) {
      kg(this, !1, e),
        e.forEach((n, i) => {
          Fg(this, !1, i), this.at(i).setValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r);
    }
    patchValue(e, r = {}) {
      e != null &&
        (e.forEach((n, i) => {
          this.at(i) && this.at(i).patchValue(n, { onlySelf: !0, emitEvent: r.emitEvent });
        }),
        this.updateValueAndValidity(r));
    }
    reset(e = [], r = {}) {
      this._forEachChild((n, i) => {
        n.reset(e[i], { onlySelf: !0, emitEvent: r.emitEvent });
      }),
        this._updatePristine(r),
        this._updateTouched(r),
        this.updateValueAndValidity(r);
    }
    getRawValue() {
      return this.controls.map((e) => e.getRawValue());
    }
    clear(e = {}) {
      this.controls.length < 1 ||
        (this._forEachChild((r) => r._registerOnCollectionChange(() => {})),
        this.controls.splice(0),
        this.updateValueAndValidity({ emitEvent: e.emitEvent }));
    }
    _adjustIndex(e) {
      return e < 0 ? e + this.length : e;
    }
    _syncPendingControls() {
      let e = this.controls.reduce((r, n) => (n._syncPendingControls() ? !0 : r), !1);
      return e && this.updateValueAndValidity({ onlySelf: !0 }), e;
    }
    _forEachChild(e) {
      this.controls.forEach((r, n) => {
        e(r, n);
      });
    }
    _updateValue() {
      this.value = this.controls.filter((e) => e.enabled || this.disabled).map((e) => e.value);
    }
    _anyControls(e) {
      return this.controls.some((r) => r.enabled && e(r));
    }
    _setUpControls() {
      this._forEachChild((e) => this._registerControl(e));
    }
    _allControlsDisabled() {
      for (let e of this.controls) if (e.enabled) return !1;
      return this.controls.length > 0 || this.disabled;
    }
    _registerControl(e) {
      e.setParent(this), e._registerOnCollectionChange(this._onCollectionChange);
    }
    _find(e) {
      return this.at(e) ?? null;
    }
  };
function bg(t) {
  return !!t && (t.asyncValidators !== void 0 || t.validators !== void 0 || t.updateOn !== void 0);
}
var zg = (() => {
  let e = class e {
    constructor() {
      this.useNonNullable = !1;
    }
    get nonNullable() {
      let n = new e();
      return (n.useNonNullable = !0), n;
    }
    group(n, i = null) {
      let o = this._reduceControls(n),
        s = {};
      return bg(i) ? (s = i) : i !== null && ((s.validators = i.validator), (s.asyncValidators = i.asyncValidator)), new Ts(o, s);
    }
    record(n, i = null) {
      let o = this._reduceControls(n);
      return new lu(o, i);
    }
    control(n, i, o) {
      let s = {};
      return this.useNonNullable
        ? (bg(i) ? (s = i) : ((s.validators = i), (s.asyncValidators = o)), new Ii(n, G(m({}, s), { nonNullable: !0 })))
        : new Ii(n, i, o);
    }
    array(n, i, o) {
      let s = n.map((a) => this._createControl(a));
      return new du(s, i, o);
    }
    _reduceControls(n) {
      let i = {};
      return (
        Object.keys(n).forEach((o) => {
          i[o] = this._createControl(n[o]);
        }),
        i
      );
    }
    _createControl(n) {
      if (n instanceof Ii) return n;
      if (n instanceof _r) return n;
      if (Array.isArray(n)) {
        let i = n[0],
          o = n.length > 1 ? n[1] : null,
          s = n.length > 2 ? n[2] : null;
        return this.control(i, o, s);
      } else return this.control(n);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var Vs = (() => {
    let e = class e {
      static withConfig(n) {
        return { ngModule: e, providers: [{ provide: ks, useValue: n.callSetDisabledState ?? Ls }] };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({ imports: [Hg] }));
    let t = e;
    return t;
  })(),
  js = (() => {
    let e = class e {
      static withConfig(n) {
        return {
          ngModule: e,
          providers: [
            { provide: Ug, useValue: n.warnOnNgModelWithFormControl ?? 'always' },
            { provide: ks, useValue: n.callSetDisabledState ?? Ls },
          ],
        };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({ imports: [Hg] }));
    let t = e;
    return t;
  })();
function _u(t) {
  return Array.isArray(t) ? t : [t];
}
function ae(t) {
  return t == null ? '' : typeof t == 'string' ? t : `${t}px`;
}
function Dr(t) {
  return t instanceof te ? t.nativeElement : t;
}
var Cu;
try {
  Cu = typeof Intl < 'u' && Intl.v8BreakIterator;
} catch {
  Cu = !1;
}
var Je = (() => {
  let e = class e {
    constructor(n) {
      (this._platformId = n),
        (this.isBrowser = this._platformId ? cr(this._platformId) : typeof document == 'object' && !!document),
        (this.EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent)),
        (this.TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent)),
        (this.BLINK = this.isBrowser && !!(window.chrome || Cu) && typeof CSS < 'u' && !this.EDGE && !this.TRIDENT),
        (this.WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT),
        (this.IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !('MSStream' in window)),
        (this.FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent)),
        (this.ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT),
        (this.SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p($e));
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var xi;
function t0() {
  if (xi == null && typeof window < 'u')
    try {
      window.addEventListener('test', null, Object.defineProperty({}, 'passive', { get: () => (xi = !0) }));
    } finally {
      xi = xi || !1;
    }
  return xi;
}
function wu(t) {
  return t0() ? t : !!t.capture;
}
var gn;
function Gg() {
  if (gn == null) {
    if (typeof document != 'object' || !document || typeof Element != 'function' || !Element) return (gn = !1), gn;
    if ('scrollBehavior' in document.documentElement.style) gn = !0;
    else {
      let t = Element.prototype.scrollTo;
      t ? (gn = !/\{\s*\[native code\]\s*\}/.test(t.toString())) : (gn = !1);
    }
  }
  return gn;
}
var Du;
function n0() {
  if (Du == null) {
    let t = typeof document < 'u' ? document.head : null;
    Du = !!(t && (t.createShadowRoot || t.attachShadow));
  }
  return Du;
}
function qg(t) {
  if (n0()) {
    let e = t.getRootNode ? t.getRootNode() : null;
    if (typeof ShadowRoot < 'u' && ShadowRoot && e instanceof ShadowRoot) return e;
  }
  return null;
}
function Ai() {
  let t = typeof document < 'u' && document ? document.activeElement : null;
  for (; t && t.shadowRoot; ) {
    let e = t.shadowRoot.activeElement;
    if (e === t) break;
    t = e;
  }
  return t;
}
function xt(t) {
  return t.composedPath ? t.composedPath()[0] : t.target;
}
function bu() {
  return (
    (typeof __karma__ < 'u' && !!__karma__) ||
    (typeof jasmine < 'u' && !!jasmine) ||
    (typeof jest < 'u' && !!jest) ||
    (typeof Mocha < 'u' && !!Mocha)
  );
}
var r0 = new b('cdk-dir-doc', { providedIn: 'root', factory: i0 });
function i0() {
  return _(B);
}
var o0 = /^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;
function s0(t) {
  let e = t?.toLowerCase() || '';
  return e === 'auto' && typeof navigator < 'u' && navigator?.language
    ? o0.test(navigator.language)
      ? 'rtl'
      : 'ltr'
    : e === 'rtl'
      ? 'rtl'
      : 'ltr';
}
var Cr = (() => {
  let e = class e {
    constructor(n) {
      if (((this.value = 'ltr'), (this.change = new U()), n)) {
        let i = n.body ? n.body.dir : null,
          o = n.documentElement ? n.documentElement.dir : null;
        this.value = s0(i || o || 'ltr');
      }
    }
    ngOnDestroy() {
      this.change.complete();
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p(r0, 8));
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var Ti = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = se({ type: e })),
    (e.ɵinj = oe({}));
  let t = e;
  return t;
})();
var c0 = 20,
  Zg = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._ngZone = n),
          (this._platform = i),
          (this._scrolled = new $()),
          (this._globalSubscription = null),
          (this._scrolledCount = 0),
          (this.scrollContainers = new Map()),
          (this._document = o);
      }
      register(n) {
        this.scrollContainers.has(n) ||
          this.scrollContainers.set(
            n,
            n.elementScrolled().subscribe(() => this._scrolled.next(n)),
          );
      }
      deregister(n) {
        let i = this.scrollContainers.get(n);
        i && (i.unsubscribe(), this.scrollContainers.delete(n));
      }
      scrolled(n = c0) {
        return this._platform.isBrowser
          ? new R((i) => {
              this._globalSubscription || this._addGlobalListener();
              let o = n > 0 ? this._scrolled.pipe(ao(n)).subscribe(i) : this._scrolled.subscribe(i);
              return (
                this._scrolledCount++,
                () => {
                  o.unsubscribe(), this._scrolledCount--, this._scrolledCount || this._removeGlobalListener();
                }
              );
            })
          : I();
      }
      ngOnDestroy() {
        this._removeGlobalListener(), this.scrollContainers.forEach((n, i) => this.deregister(i)), this._scrolled.complete();
      }
      ancestorScrolled(n, i) {
        let o = this.getAncestorScrollContainers(n);
        return this.scrolled(i).pipe(fe((s) => !s || o.indexOf(s) > -1));
      }
      getAncestorScrollContainers(n) {
        let i = [];
        return (
          this.scrollContainers.forEach((o, s) => {
            this._scrollableContainsElement(s, n) && i.push(s);
          }),
          i
        );
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _scrollableContainsElement(n, i) {
        let o = Dr(i),
          s = n.getElementRef().nativeElement;
        do if (o == s) return !0;
        while ((o = o.parentElement));
        return !1;
      }
      _addGlobalListener() {
        this._globalSubscription = this._ngZone.runOutsideAngular(() => {
          let n = this._getWindow();
          return Ar(n.document, 'scroll').subscribe(() => this._scrolled.next());
        });
      }
      _removeGlobalListener() {
        this._globalSubscription && (this._globalSubscription.unsubscribe(), (this._globalSubscription = null));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(j), p(Je), p(B, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var l0 = 20,
  Oi = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._platform = n),
          (this._change = new $()),
          (this._changeListener = (s) => {
            this._change.next(s);
          }),
          (this._document = o),
          i.runOutsideAngular(() => {
            if (n.isBrowser) {
              let s = this._getWindow();
              s.addEventListener('resize', this._changeListener), s.addEventListener('orientationchange', this._changeListener);
            }
            this.change().subscribe(() => (this._viewportSize = null));
          });
      }
      ngOnDestroy() {
        if (this._platform.isBrowser) {
          let n = this._getWindow();
          n.removeEventListener('resize', this._changeListener), n.removeEventListener('orientationchange', this._changeListener);
        }
        this._change.complete();
      }
      getViewportSize() {
        this._viewportSize || this._updateViewportSize();
        let n = { width: this._viewportSize.width, height: this._viewportSize.height };
        return this._platform.isBrowser || (this._viewportSize = null), n;
      }
      getViewportRect() {
        let n = this.getViewportScrollPosition(),
          { width: i, height: o } = this.getViewportSize();
        return { top: n.top, left: n.left, bottom: n.top + o, right: n.left + i, height: o, width: i };
      }
      getViewportScrollPosition() {
        if (!this._platform.isBrowser) return { top: 0, left: 0 };
        let n = this._document,
          i = this._getWindow(),
          o = n.documentElement,
          s = o.getBoundingClientRect(),
          a = -s.top || n.body.scrollTop || i.scrollY || o.scrollTop || 0,
          c = -s.left || n.body.scrollLeft || i.scrollX || o.scrollLeft || 0;
        return { top: a, left: c };
      }
      change(n = l0) {
        return n > 0 ? this._change.pipe(ao(n)) : this._change;
      }
      _getWindow() {
        return this._document.defaultView || window;
      }
      _updateViewportSize() {
        let n = this._getWindow();
        this._viewportSize = this._platform.isBrowser ? { width: n.innerWidth, height: n.innerHeight } : { width: 0, height: 0 };
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(Je), p(j), p(B, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var Yg = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({}));
    let t = e;
    return t;
  })(),
  Iu = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({ imports: [Ti, Yg, Ti, Yg] }));
    let t = e;
    return t;
  })();
var Ri = class {
    attach(e) {
      return (this._attachedHost = e), e.attach(this);
    }
    detach() {
      let e = this._attachedHost;
      e != null && ((this._attachedHost = null), e.detach());
    }
    get isAttached() {
      return this._attachedHost != null;
    }
    setAttachedHost(e) {
      this._attachedHost = e;
    }
  },
  wr = class extends Ri {
    constructor(e, r, n, i, o) {
      super(),
        (this.component = e),
        (this.viewContainerRef = r),
        (this.injector = n),
        (this.componentFactoryResolver = i),
        (this.projectableNodes = o);
    }
  },
  mn = class extends Ri {
    constructor(e, r, n, i) {
      super(), (this.templateRef = e), (this.viewContainerRef = r), (this.context = n), (this.injector = i);
    }
    get origin() {
      return this.templateRef.elementRef;
    }
    attach(e, r = this.context) {
      return (this.context = r), super.attach(e);
    }
    detach() {
      return (this.context = void 0), super.detach();
    }
  },
  Mu = class extends Ri {
    constructor(e) {
      super(), (this.element = e instanceof te ? e.nativeElement : e);
    }
  },
  br = class {
    constructor() {
      (this._isDisposed = !1), (this.attachDomPortal = null);
    }
    hasAttached() {
      return !!this._attachedPortal;
    }
    attach(e) {
      if (e instanceof wr) return (this._attachedPortal = e), this.attachComponentPortal(e);
      if (e instanceof mn) return (this._attachedPortal = e), this.attachTemplatePortal(e);
      if (this.attachDomPortal && e instanceof Mu) return (this._attachedPortal = e), this.attachDomPortal(e);
    }
    detach() {
      this._attachedPortal && (this._attachedPortal.setAttachedHost(null), (this._attachedPortal = null)), this._invokeDisposeFn();
    }
    dispose() {
      this.hasAttached() && this.detach(), this._invokeDisposeFn(), (this._isDisposed = !0);
    }
    setDisposeFn(e) {
      this._disposeFn = e;
    }
    _invokeDisposeFn() {
      this._disposeFn && (this._disposeFn(), (this._disposeFn = null));
    }
  };
var Bs = class extends br {
  constructor(e, r, n, i, o) {
    super(),
      (this.outletElement = e),
      (this._componentFactoryResolver = r),
      (this._appRef = n),
      (this._defaultInjector = i),
      (this.attachDomPortal = (s) => {
        this._document;
        let a = s.element;
        a.parentNode;
        let c = this._document.createComment('dom-portal');
        a.parentNode.insertBefore(c, a),
          this.outletElement.appendChild(a),
          (this._attachedPortal = s),
          super.setDisposeFn(() => {
            c.parentNode && c.parentNode.replaceChild(a, c);
          });
      }),
      (this._document = o);
  }
  attachComponentPortal(e) {
    let n = (e.componentFactoryResolver || this._componentFactoryResolver).resolveComponentFactory(e.component),
      i;
    return (
      e.viewContainerRef
        ? ((i = e.viewContainerRef.createComponent(
            n,
            e.viewContainerRef.length,
            e.injector || e.viewContainerRef.injector,
            e.projectableNodes || void 0,
          )),
          this.setDisposeFn(() => i.destroy()))
        : ((i = n.create(e.injector || this._defaultInjector || ge.NULL)),
          this._appRef.attachView(i.hostView),
          this.setDisposeFn(() => {
            this._appRef.viewCount > 0 && this._appRef.detachView(i.hostView), i.destroy();
          })),
      this.outletElement.appendChild(this._getComponentRootNode(i)),
      (this._attachedPortal = e),
      i
    );
  }
  attachTemplatePortal(e) {
    let r = e.viewContainerRef,
      n = r.createEmbeddedView(e.templateRef, e.context, { injector: e.injector });
    return (
      n.rootNodes.forEach((i) => this.outletElement.appendChild(i)),
      n.detectChanges(),
      this.setDisposeFn(() => {
        let i = r.indexOf(n);
        i !== -1 && r.remove(i);
      }),
      (this._attachedPortal = e),
      n
    );
  }
  dispose() {
    super.dispose(), this.outletElement.remove();
  }
  _getComponentRootNode(e) {
    return e.hostView.rootNodes[0];
  }
};
var $s = (() => {
  let e = class e extends br {
    constructor(n, i, o) {
      super(),
        (this._componentFactoryResolver = n),
        (this._viewContainerRef = i),
        (this._isInitialized = !1),
        (this.attached = new U()),
        (this.attachDomPortal = (s) => {
          this._document;
          let a = s.element;
          a.parentNode;
          let c = this._document.createComment('dom-portal');
          s.setAttachedHost(this),
            a.parentNode.insertBefore(c, a),
            this._getRootNode().appendChild(a),
            (this._attachedPortal = s),
            super.setDisposeFn(() => {
              c.parentNode && c.parentNode.replaceChild(a, c);
            });
        }),
        (this._document = o);
    }
    get portal() {
      return this._attachedPortal;
    }
    set portal(n) {
      (this.hasAttached() && !n && !this._isInitialized) ||
        (this.hasAttached() && super.detach(), n && super.attach(n), (this._attachedPortal = n || null));
    }
    get attachedRef() {
      return this._attachedRef;
    }
    ngOnInit() {
      this._isInitialized = !0;
    }
    ngOnDestroy() {
      super.dispose(), (this._attachedRef = this._attachedPortal = null);
    }
    attachComponentPortal(n) {
      n.setAttachedHost(this);
      let i = n.viewContainerRef != null ? n.viewContainerRef : this._viewContainerRef,
        s = (n.componentFactoryResolver || this._componentFactoryResolver).resolveComponentFactory(n.component),
        a = i.createComponent(s, i.length, n.injector || i.injector, n.projectableNodes || void 0);
      return (
        i !== this._viewContainerRef && this._getRootNode().appendChild(a.hostView.rootNodes[0]),
        super.setDisposeFn(() => a.destroy()),
        (this._attachedPortal = n),
        (this._attachedRef = a),
        this.attached.emit(a),
        a
      );
    }
    attachTemplatePortal(n) {
      n.setAttachedHost(this);
      let i = this._viewContainerRef.createEmbeddedView(n.templateRef, n.context, { injector: n.injector });
      return (
        super.setDisposeFn(() => this._viewContainerRef.clear()),
        (this._attachedPortal = n),
        (this._attachedRef = i),
        this.attached.emit(i),
        i
      );
    }
    _getRootNode() {
      let n = this._viewContainerRef.element.nativeElement;
      return n.nodeType === n.ELEMENT_NODE ? n : n.parentNode;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(Lt), v(Fe), v(B));
  }),
    (e.ɵdir = re({
      type: e,
      selectors: [['', 'cdkPortalOutlet', '']],
      inputs: { portal: ['cdkPortalOutlet', 'portal'] },
      outputs: { attached: 'attached' },
      exportAs: ['cdkPortalOutlet'],
      features: [Re],
    }));
  let t = e;
  return t;
})();
var Us = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵmod = se({ type: e })),
    (e.ɵinj = oe({}));
  let t = e;
  return t;
})();
function Hs(t, ...e) {
  return e.length ? e.some((r) => t[r]) : t.altKey || t.shiftKey || t.ctrlKey || t.metaKey;
}
var Qg = Gg(),
  Su = class {
    constructor(e, r) {
      (this._viewportRuler = e), (this._previousHTMLStyles = { top: '', left: '' }), (this._isEnabled = !1), (this._document = r);
    }
    attach() {}
    enable() {
      if (this._canBeEnabled()) {
        let e = this._document.documentElement;
        (this._previousScrollPosition = this._viewportRuler.getViewportScrollPosition()),
          (this._previousHTMLStyles.left = e.style.left || ''),
          (this._previousHTMLStyles.top = e.style.top || ''),
          (e.style.left = ae(-this._previousScrollPosition.left)),
          (e.style.top = ae(-this._previousScrollPosition.top)),
          e.classList.add('cdk-global-scrollblock'),
          (this._isEnabled = !0);
      }
    }
    disable() {
      if (this._isEnabled) {
        let e = this._document.documentElement,
          r = this._document.body,
          n = e.style,
          i = r.style,
          o = n.scrollBehavior || '',
          s = i.scrollBehavior || '';
        (this._isEnabled = !1),
          (n.left = this._previousHTMLStyles.left),
          (n.top = this._previousHTMLStyles.top),
          e.classList.remove('cdk-global-scrollblock'),
          Qg && (n.scrollBehavior = i.scrollBehavior = 'auto'),
          window.scroll(this._previousScrollPosition.left, this._previousScrollPosition.top),
          Qg && ((n.scrollBehavior = o), (i.scrollBehavior = s));
      }
    }
    _canBeEnabled() {
      if (this._document.documentElement.classList.contains('cdk-global-scrollblock') || this._isEnabled) return !1;
      let r = this._document.body,
        n = this._viewportRuler.getViewportSize();
      return r.scrollHeight > n.height || r.scrollWidth > n.width;
    }
  };
var xu = class {
    constructor(e, r, n, i) {
      (this._scrollDispatcher = e),
        (this._ngZone = r),
        (this._viewportRuler = n),
        (this._config = i),
        (this._scrollSubscription = null),
        (this._detach = () => {
          this.disable(), this._overlayRef.hasAttached() && this._ngZone.run(() => this._overlayRef.detach());
        });
    }
    attach(e) {
      this._overlayRef, (this._overlayRef = e);
    }
    enable() {
      if (this._scrollSubscription) return;
      let e = this._scrollDispatcher
        .scrolled(0)
        .pipe(fe((r) => !r || !this._overlayRef.overlayElement.contains(r.getElementRef().nativeElement)));
      this._config && this._config.threshold && this._config.threshold > 1
        ? ((this._initialScrollPosition = this._viewportRuler.getViewportScrollPosition().top),
          (this._scrollSubscription = e.subscribe(() => {
            let r = this._viewportRuler.getViewportScrollPosition().top;
            Math.abs(r - this._initialScrollPosition) > this._config.threshold ? this._detach() : this._overlayRef.updatePosition();
          })))
        : (this._scrollSubscription = e.subscribe(this._detach));
    }
    disable() {
      this._scrollSubscription && (this._scrollSubscription.unsubscribe(), (this._scrollSubscription = null));
    }
    detach() {
      this.disable(), (this._overlayRef = null);
    }
  },
  zs = class {
    enable() {}
    disable() {}
    attach() {}
  };
function Au(t, e) {
  return e.some((r) => {
    let n = t.bottom < r.top,
      i = t.top > r.bottom,
      o = t.right < r.left,
      s = t.left > r.right;
    return n || i || o || s;
  });
}
function Xg(t, e) {
  return e.some((r) => {
    let n = t.top < r.top,
      i = t.bottom > r.bottom,
      o = t.left < r.left,
      s = t.right > r.right;
    return n || i || o || s;
  });
}
var Tu = class {
    constructor(e, r, n, i) {
      (this._scrollDispatcher = e), (this._viewportRuler = r), (this._ngZone = n), (this._config = i), (this._scrollSubscription = null);
    }
    attach(e) {
      this._overlayRef, (this._overlayRef = e);
    }
    enable() {
      if (!this._scrollSubscription) {
        let e = this._config ? this._config.scrollThrottle : 0;
        this._scrollSubscription = this._scrollDispatcher.scrolled(e).subscribe(() => {
          if ((this._overlayRef.updatePosition(), this._config && this._config.autoClose)) {
            let r = this._overlayRef.overlayElement.getBoundingClientRect(),
              { width: n, height: i } = this._viewportRuler.getViewportSize();
            Au(r, [{ width: n, height: i, bottom: i, right: n, top: 0, left: 0 }]) &&
              (this.disable(), this._ngZone.run(() => this._overlayRef.detach()));
          }
        });
      }
    }
    disable() {
      this._scrollSubscription && (this._scrollSubscription.unsubscribe(), (this._scrollSubscription = null));
    }
    detach() {
      this.disable(), (this._overlayRef = null);
    }
  },
  d0 = (() => {
    let e = class e {
      constructor(n, i, o, s) {
        (this._scrollDispatcher = n),
          (this._viewportRuler = i),
          (this._ngZone = o),
          (this.noop = () => new zs()),
          (this.close = (a) => new xu(this._scrollDispatcher, this._ngZone, this._viewportRuler, a)),
          (this.block = () => new Su(this._viewportRuler, this._document)),
          (this.reposition = (a) => new Tu(this._scrollDispatcher, this._viewportRuler, this._ngZone, a)),
          (this._document = s);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(Zg), p(Oi), p(j), p(B));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Er = class {
    constructor(e) {
      if (
        ((this.scrollStrategy = new zs()),
        (this.panelClass = ''),
        (this.hasBackdrop = !1),
        (this.backdropClass = 'cdk-overlay-dark-backdrop'),
        (this.disposeOnNavigation = !1),
        e)
      ) {
        let r = Object.keys(e);
        for (let n of r) e[n] !== void 0 && (this[n] = e[n]);
      }
    }
  };
var Ou = class {
  constructor(e, r) {
    (this.connectionPair = e), (this.scrollableViewProperties = r);
  }
};
var rm = (() => {
    let e = class e {
      constructor(n) {
        (this._attachedOverlays = []), (this._document = n);
      }
      ngOnDestroy() {
        this.detach();
      }
      add(n) {
        this.remove(n), this._attachedOverlays.push(n);
      }
      remove(n) {
        let i = this._attachedOverlays.indexOf(n);
        i > -1 && this._attachedOverlays.splice(i, 1), this._attachedOverlays.length === 0 && this.detach();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  f0 = (() => {
    let e = class e extends rm {
      constructor(n, i) {
        super(n),
          (this._ngZone = i),
          (this._keydownListener = (o) => {
            let s = this._attachedOverlays;
            for (let a = s.length - 1; a > -1; a--)
              if (s[a]._keydownEvents.observers.length > 0) {
                let c = s[a]._keydownEvents;
                this._ngZone ? this._ngZone.run(() => c.next(o)) : c.next(o);
                break;
              }
          });
      }
      add(n) {
        super.add(n),
          this._isAttached ||
            (this._ngZone
              ? this._ngZone.runOutsideAngular(() => this._document.body.addEventListener('keydown', this._keydownListener))
              : this._document.body.addEventListener('keydown', this._keydownListener),
            (this._isAttached = !0));
      }
      detach() {
        this._isAttached && (this._document.body.removeEventListener('keydown', this._keydownListener), (this._isAttached = !1));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B), p(j, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  h0 = (() => {
    let e = class e extends rm {
      constructor(n, i, o) {
        super(n),
          (this._platform = i),
          (this._ngZone = o),
          (this._cursorStyleIsSet = !1),
          (this._pointerDownListener = (s) => {
            this._pointerDownEventTarget = xt(s);
          }),
          (this._clickListener = (s) => {
            let a = xt(s),
              c = s.type === 'click' && this._pointerDownEventTarget ? this._pointerDownEventTarget : a;
            this._pointerDownEventTarget = null;
            let l = this._attachedOverlays.slice();
            for (let u = l.length - 1; u > -1; u--) {
              let d = l[u];
              if (d._outsidePointerEvents.observers.length < 1 || !d.hasAttached()) continue;
              if (d.overlayElement.contains(a) || d.overlayElement.contains(c)) break;
              let f = d._outsidePointerEvents;
              this._ngZone ? this._ngZone.run(() => f.next(s)) : f.next(s);
            }
          });
      }
      add(n) {
        if ((super.add(n), !this._isAttached)) {
          let i = this._document.body;
          this._ngZone ? this._ngZone.runOutsideAngular(() => this._addEventListeners(i)) : this._addEventListeners(i),
            this._platform.IOS &&
              !this._cursorStyleIsSet &&
              ((this._cursorOriginalValue = i.style.cursor), (i.style.cursor = 'pointer'), (this._cursorStyleIsSet = !0)),
            (this._isAttached = !0);
        }
      }
      detach() {
        if (this._isAttached) {
          let n = this._document.body;
          n.removeEventListener('pointerdown', this._pointerDownListener, !0),
            n.removeEventListener('click', this._clickListener, !0),
            n.removeEventListener('auxclick', this._clickListener, !0),
            n.removeEventListener('contextmenu', this._clickListener, !0),
            this._platform.IOS && this._cursorStyleIsSet && ((n.style.cursor = this._cursorOriginalValue), (this._cursorStyleIsSet = !1)),
            (this._isAttached = !1);
        }
      }
      _addEventListeners(n) {
        n.addEventListener('pointerdown', this._pointerDownListener, !0),
          n.addEventListener('click', this._clickListener, !0),
          n.addEventListener('auxclick', this._clickListener, !0),
          n.addEventListener('contextmenu', this._clickListener, !0);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B), p(Je), p(j, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  Ws = (() => {
    let e = class e {
      constructor(n, i) {
        (this._platform = i), (this._document = n);
      }
      ngOnDestroy() {
        this._containerElement?.remove();
      }
      getContainerElement() {
        return this._containerElement || this._createContainer(), this._containerElement;
      }
      _createContainer() {
        let n = 'cdk-overlay-container';
        if (this._platform.isBrowser || bu()) {
          let o = this._document.querySelectorAll(`.${n}[platform="server"], .${n}[platform="test"]`);
          for (let s = 0; s < o.length; s++) o[s].remove();
        }
        let i = this._document.createElement('div');
        i.classList.add(n),
          bu() ? i.setAttribute('platform', 'test') : this._platform.isBrowser || i.setAttribute('platform', 'server'),
          this._document.body.appendChild(i),
          (this._containerElement = i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(B), p(Je));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  yn = class {
    constructor(e, r, n, i, o, s, a, c, l, u = !1) {
      (this._portalOutlet = e),
        (this._host = r),
        (this._pane = n),
        (this._config = i),
        (this._ngZone = o),
        (this._keyboardDispatcher = s),
        (this._document = a),
        (this._location = c),
        (this._outsideClickDispatcher = l),
        (this._animationsDisabled = u),
        (this._backdropElement = null),
        (this._backdropClick = new $()),
        (this._attachments = new $()),
        (this._detachments = new $()),
        (this._locationChanges = q.EMPTY),
        (this._backdropClickHandler = (d) => this._backdropClick.next(d)),
        (this._backdropTransitionendHandler = (d) => {
          this._disposeBackdrop(d.target);
        }),
        (this._keydownEvents = new $()),
        (this._outsidePointerEvents = new $()),
        i.scrollStrategy && ((this._scrollStrategy = i.scrollStrategy), this._scrollStrategy.attach(this)),
        (this._positionStrategy = i.positionStrategy);
    }
    get overlayElement() {
      return this._pane;
    }
    get backdropElement() {
      return this._backdropElement;
    }
    get hostElement() {
      return this._host;
    }
    attach(e) {
      !this._host.parentElement && this._previousHostParent && this._previousHostParent.appendChild(this._host);
      let r = this._portalOutlet.attach(e);
      return (
        this._positionStrategy && this._positionStrategy.attach(this),
        this._updateStackingOrder(),
        this._updateElementSize(),
        this._updateElementDirection(),
        this._scrollStrategy && this._scrollStrategy.enable(),
        this._ngZone.onStable.pipe(me(1)).subscribe(() => {
          this.hasAttached() && this.updatePosition();
        }),
        this._togglePointerEvents(!0),
        this._config.hasBackdrop && this._attachBackdrop(),
        this._config.panelClass && this._toggleClasses(this._pane, this._config.panelClass, !0),
        this._attachments.next(),
        this._keyboardDispatcher.add(this),
        this._config.disposeOnNavigation && (this._locationChanges = this._location.subscribe(() => this.dispose())),
        this._outsideClickDispatcher.add(this),
        typeof r?.onDestroy == 'function' &&
          r.onDestroy(() => {
            this.hasAttached() && this._ngZone.runOutsideAngular(() => Promise.resolve().then(() => this.detach()));
          }),
        r
      );
    }
    detach() {
      if (!this.hasAttached()) return;
      this.detachBackdrop(),
        this._togglePointerEvents(!1),
        this._positionStrategy && this._positionStrategy.detach && this._positionStrategy.detach(),
        this._scrollStrategy && this._scrollStrategy.disable();
      let e = this._portalOutlet.detach();
      return (
        this._detachments.next(),
        this._keyboardDispatcher.remove(this),
        this._detachContentWhenStable(),
        this._locationChanges.unsubscribe(),
        this._outsideClickDispatcher.remove(this),
        e
      );
    }
    dispose() {
      let e = this.hasAttached();
      this._positionStrategy && this._positionStrategy.dispose(),
        this._disposeScrollStrategy(),
        this._disposeBackdrop(this._backdropElement),
        this._locationChanges.unsubscribe(),
        this._keyboardDispatcher.remove(this),
        this._portalOutlet.dispose(),
        this._attachments.complete(),
        this._backdropClick.complete(),
        this._keydownEvents.complete(),
        this._outsidePointerEvents.complete(),
        this._outsideClickDispatcher.remove(this),
        this._host?.remove(),
        (this._previousHostParent = this._pane = this._host = null),
        e && this._detachments.next(),
        this._detachments.complete();
    }
    hasAttached() {
      return this._portalOutlet.hasAttached();
    }
    backdropClick() {
      return this._backdropClick;
    }
    attachments() {
      return this._attachments;
    }
    detachments() {
      return this._detachments;
    }
    keydownEvents() {
      return this._keydownEvents;
    }
    outsidePointerEvents() {
      return this._outsidePointerEvents;
    }
    getConfig() {
      return this._config;
    }
    updatePosition() {
      this._positionStrategy && this._positionStrategy.apply();
    }
    updatePositionStrategy(e) {
      e !== this._positionStrategy &&
        (this._positionStrategy && this._positionStrategy.dispose(),
        (this._positionStrategy = e),
        this.hasAttached() && (e.attach(this), this.updatePosition()));
    }
    updateSize(e) {
      (this._config = m(m({}, this._config), e)), this._updateElementSize();
    }
    setDirection(e) {
      (this._config = G(m({}, this._config), { direction: e })), this._updateElementDirection();
    }
    addPanelClass(e) {
      this._pane && this._toggleClasses(this._pane, e, !0);
    }
    removePanelClass(e) {
      this._pane && this._toggleClasses(this._pane, e, !1);
    }
    getDirection() {
      let e = this._config.direction;
      return e ? (typeof e == 'string' ? e : e.value) : 'ltr';
    }
    updateScrollStrategy(e) {
      e !== this._scrollStrategy &&
        (this._disposeScrollStrategy(), (this._scrollStrategy = e), this.hasAttached() && (e.attach(this), e.enable()));
    }
    _updateElementDirection() {
      this._host.setAttribute('dir', this.getDirection());
    }
    _updateElementSize() {
      if (!this._pane) return;
      let e = this._pane.style;
      (e.width = ae(this._config.width)),
        (e.height = ae(this._config.height)),
        (e.minWidth = ae(this._config.minWidth)),
        (e.minHeight = ae(this._config.minHeight)),
        (e.maxWidth = ae(this._config.maxWidth)),
        (e.maxHeight = ae(this._config.maxHeight));
    }
    _togglePointerEvents(e) {
      this._pane.style.pointerEvents = e ? '' : 'none';
    }
    _attachBackdrop() {
      let e = 'cdk-overlay-backdrop-showing';
      (this._backdropElement = this._document.createElement('div')),
        this._backdropElement.classList.add('cdk-overlay-backdrop'),
        this._animationsDisabled && this._backdropElement.classList.add('cdk-overlay-backdrop-noop-animation'),
        this._config.backdropClass && this._toggleClasses(this._backdropElement, this._config.backdropClass, !0),
        this._host.parentElement.insertBefore(this._backdropElement, this._host),
        this._backdropElement.addEventListener('click', this._backdropClickHandler),
        !this._animationsDisabled && typeof requestAnimationFrame < 'u'
          ? this._ngZone.runOutsideAngular(() => {
              requestAnimationFrame(() => {
                this._backdropElement && this._backdropElement.classList.add(e);
              });
            })
          : this._backdropElement.classList.add(e);
    }
    _updateStackingOrder() {
      this._host.nextSibling && this._host.parentNode.appendChild(this._host);
    }
    detachBackdrop() {
      let e = this._backdropElement;
      if (e) {
        if (this._animationsDisabled) {
          this._disposeBackdrop(e);
          return;
        }
        e.classList.remove('cdk-overlay-backdrop-showing'),
          this._ngZone.runOutsideAngular(() => {
            e.addEventListener('transitionend', this._backdropTransitionendHandler);
          }),
          (e.style.pointerEvents = 'none'),
          (this._backdropTimeout = this._ngZone.runOutsideAngular(() =>
            setTimeout(() => {
              this._disposeBackdrop(e);
            }, 500),
          ));
      }
    }
    _toggleClasses(e, r, n) {
      let i = _u(r || []).filter((o) => !!o);
      i.length && (n ? e.classList.add(...i) : e.classList.remove(...i));
    }
    _detachContentWhenStable() {
      this._ngZone.runOutsideAngular(() => {
        let e = this._ngZone.onStable.pipe(nt(Tr(this._attachments, this._detachments))).subscribe(() => {
          (!this._pane || !this._host || this._pane.children.length === 0) &&
            (this._pane && this._config.panelClass && this._toggleClasses(this._pane, this._config.panelClass, !1),
            this._host && this._host.parentElement && ((this._previousHostParent = this._host.parentElement), this._host.remove()),
            e.unsubscribe());
        });
      });
    }
    _disposeScrollStrategy() {
      let e = this._scrollStrategy;
      e && (e.disable(), e.detach && e.detach());
    }
    _disposeBackdrop(e) {
      e &&
        (e.removeEventListener('click', this._backdropClickHandler),
        e.removeEventListener('transitionend', this._backdropTransitionendHandler),
        e.remove(),
        this._backdropElement === e && (this._backdropElement = null)),
        this._backdropTimeout && (clearTimeout(this._backdropTimeout), (this._backdropTimeout = void 0));
    }
  },
  Jg = 'cdk-overlay-connected-position-bounding-box',
  p0 = /([A-Za-z%]+)$/,
  Ru = class {
    get positions() {
      return this._preferredPositions;
    }
    constructor(e, r, n, i, o) {
      (this._viewportRuler = r),
        (this._document = n),
        (this._platform = i),
        (this._overlayContainer = o),
        (this._lastBoundingBoxSize = { width: 0, height: 0 }),
        (this._isPushed = !1),
        (this._canPush = !0),
        (this._growAfterOpen = !1),
        (this._hasFlexibleDimensions = !0),
        (this._positionLocked = !1),
        (this._viewportMargin = 0),
        (this._scrollables = []),
        (this._preferredPositions = []),
        (this._positionChanges = new $()),
        (this._resizeSubscription = q.EMPTY),
        (this._offsetX = 0),
        (this._offsetY = 0),
        (this._appliedPanelClasses = []),
        (this.positionChanges = this._positionChanges),
        this.setOrigin(e);
    }
    attach(e) {
      this._overlayRef && this._overlayRef,
        this._validatePositions(),
        e.hostElement.classList.add(Jg),
        (this._overlayRef = e),
        (this._boundingBox = e.hostElement),
        (this._pane = e.overlayElement),
        (this._isDisposed = !1),
        (this._isInitialRender = !0),
        (this._lastPosition = null),
        this._resizeSubscription.unsubscribe(),
        (this._resizeSubscription = this._viewportRuler.change().subscribe(() => {
          (this._isInitialRender = !0), this.apply();
        }));
    }
    apply() {
      if (this._isDisposed || !this._platform.isBrowser) return;
      if (!this._isInitialRender && this._positionLocked && this._lastPosition) {
        this.reapplyLastPosition();
        return;
      }
      this._clearPanelClasses(),
        this._resetOverlayElementStyles(),
        this._resetBoundingBoxStyles(),
        (this._viewportRect = this._getNarrowedViewportRect()),
        (this._originRect = this._getOriginRect()),
        (this._overlayRect = this._pane.getBoundingClientRect()),
        (this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect());
      let e = this._originRect,
        r = this._overlayRect,
        n = this._viewportRect,
        i = this._containerRect,
        o = [],
        s;
      for (let a of this._preferredPositions) {
        let c = this._getOriginPoint(e, i, a),
          l = this._getOverlayPoint(c, r, a),
          u = this._getOverlayFit(l, r, n, a);
        if (u.isCompletelyWithinViewport) {
          (this._isPushed = !1), this._applyPosition(a, c);
          return;
        }
        if (this._canFitWithFlexibleDimensions(u, l, n)) {
          o.push({ position: a, origin: c, overlayRect: r, boundingBoxRect: this._calculateBoundingBoxRect(c, a) });
          continue;
        }
        (!s || s.overlayFit.visibleArea < u.visibleArea) &&
          (s = { overlayFit: u, overlayPoint: l, originPoint: c, position: a, overlayRect: r });
      }
      if (o.length) {
        let a = null,
          c = -1;
        for (let l of o) {
          let u = l.boundingBoxRect.width * l.boundingBoxRect.height * (l.position.weight || 1);
          u > c && ((c = u), (a = l));
        }
        (this._isPushed = !1), this._applyPosition(a.position, a.origin);
        return;
      }
      if (this._canPush) {
        (this._isPushed = !0), this._applyPosition(s.position, s.originPoint);
        return;
      }
      this._applyPosition(s.position, s.originPoint);
    }
    detach() {
      this._clearPanelClasses(), (this._lastPosition = null), (this._previousPushAmount = null), this._resizeSubscription.unsubscribe();
    }
    dispose() {
      this._isDisposed ||
        (this._boundingBox &&
          vn(this._boundingBox.style, {
            top: '',
            left: '',
            right: '',
            bottom: '',
            height: '',
            width: '',
            alignItems: '',
            justifyContent: '',
          }),
        this._pane && this._resetOverlayElementStyles(),
        this._overlayRef && this._overlayRef.hostElement.classList.remove(Jg),
        this.detach(),
        this._positionChanges.complete(),
        (this._overlayRef = this._boundingBox = null),
        (this._isDisposed = !0));
    }
    reapplyLastPosition() {
      if (this._isDisposed || !this._platform.isBrowser) return;
      let e = this._lastPosition;
      if (e) {
        (this._originRect = this._getOriginRect()),
          (this._overlayRect = this._pane.getBoundingClientRect()),
          (this._viewportRect = this._getNarrowedViewportRect()),
          (this._containerRect = this._overlayContainer.getContainerElement().getBoundingClientRect());
        let r = this._getOriginPoint(this._originRect, this._containerRect, e);
        this._applyPosition(e, r);
      } else this.apply();
    }
    withScrollableContainers(e) {
      return (this._scrollables = e), this;
    }
    withPositions(e) {
      return (
        (this._preferredPositions = e), e.indexOf(this._lastPosition) === -1 && (this._lastPosition = null), this._validatePositions(), this
      );
    }
    withViewportMargin(e) {
      return (this._viewportMargin = e), this;
    }
    withFlexibleDimensions(e = !0) {
      return (this._hasFlexibleDimensions = e), this;
    }
    withGrowAfterOpen(e = !0) {
      return (this._growAfterOpen = e), this;
    }
    withPush(e = !0) {
      return (this._canPush = e), this;
    }
    withLockedPosition(e = !0) {
      return (this._positionLocked = e), this;
    }
    setOrigin(e) {
      return (this._origin = e), this;
    }
    withDefaultOffsetX(e) {
      return (this._offsetX = e), this;
    }
    withDefaultOffsetY(e) {
      return (this._offsetY = e), this;
    }
    withTransformOriginOn(e) {
      return (this._transformOriginSelector = e), this;
    }
    _getOriginPoint(e, r, n) {
      let i;
      if (n.originX == 'center') i = e.left + e.width / 2;
      else {
        let s = this._isRtl() ? e.right : e.left,
          a = this._isRtl() ? e.left : e.right;
        i = n.originX == 'start' ? s : a;
      }
      r.left < 0 && (i -= r.left);
      let o;
      return (
        n.originY == 'center' ? (o = e.top + e.height / 2) : (o = n.originY == 'top' ? e.top : e.bottom),
        r.top < 0 && (o -= r.top),
        { x: i, y: o }
      );
    }
    _getOverlayPoint(e, r, n) {
      let i;
      n.overlayX == 'center'
        ? (i = -r.width / 2)
        : n.overlayX === 'start'
          ? (i = this._isRtl() ? -r.width : 0)
          : (i = this._isRtl() ? 0 : -r.width);
      let o;
      return n.overlayY == 'center' ? (o = -r.height / 2) : (o = n.overlayY == 'top' ? 0 : -r.height), { x: e.x + i, y: e.y + o };
    }
    _getOverlayFit(e, r, n, i) {
      let o = tm(r),
        { x: s, y: a } = e,
        c = this._getOffset(i, 'x'),
        l = this._getOffset(i, 'y');
      c && (s += c), l && (a += l);
      let u = 0 - s,
        d = s + o.width - n.width,
        f = 0 - a,
        h = a + o.height - n.height,
        g = this._subtractOverflows(o.width, u, d),
        w = this._subtractOverflows(o.height, f, h),
        H = g * w;
      return {
        visibleArea: H,
        isCompletelyWithinViewport: o.width * o.height === H,
        fitsInViewportVertically: w === o.height,
        fitsInViewportHorizontally: g == o.width,
      };
    }
    _canFitWithFlexibleDimensions(e, r, n) {
      if (this._hasFlexibleDimensions) {
        let i = n.bottom - r.y,
          o = n.right - r.x,
          s = em(this._overlayRef.getConfig().minHeight),
          a = em(this._overlayRef.getConfig().minWidth),
          c = e.fitsInViewportVertically || (s != null && s <= i),
          l = e.fitsInViewportHorizontally || (a != null && a <= o);
        return c && l;
      }
      return !1;
    }
    _pushOverlayOnScreen(e, r, n) {
      if (this._previousPushAmount && this._positionLocked)
        return { x: e.x + this._previousPushAmount.x, y: e.y + this._previousPushAmount.y };
      let i = tm(r),
        o = this._viewportRect,
        s = Math.max(e.x + i.width - o.width, 0),
        a = Math.max(e.y + i.height - o.height, 0),
        c = Math.max(o.top - n.top - e.y, 0),
        l = Math.max(o.left - n.left - e.x, 0),
        u = 0,
        d = 0;
      return (
        i.width <= o.width ? (u = l || -s) : (u = e.x < this._viewportMargin ? o.left - n.left - e.x : 0),
        i.height <= o.height ? (d = c || -a) : (d = e.y < this._viewportMargin ? o.top - n.top - e.y : 0),
        (this._previousPushAmount = { x: u, y: d }),
        { x: e.x + u, y: e.y + d }
      );
    }
    _applyPosition(e, r) {
      if (
        (this._setTransformOrigin(e),
        this._setOverlayElementStyles(r, e),
        this._setBoundingBoxStyles(r, e),
        e.panelClass && this._addPanelClasses(e.panelClass),
        (this._lastPosition = e),
        this._positionChanges.observers.length)
      ) {
        let n = this._getScrollVisibility(),
          i = new Ou(e, n);
        this._positionChanges.next(i);
      }
      this._isInitialRender = !1;
    }
    _setTransformOrigin(e) {
      if (!this._transformOriginSelector) return;
      let r = this._boundingBox.querySelectorAll(this._transformOriginSelector),
        n,
        i = e.overlayY;
      e.overlayX === 'center'
        ? (n = 'center')
        : this._isRtl()
          ? (n = e.overlayX === 'start' ? 'right' : 'left')
          : (n = e.overlayX === 'start' ? 'left' : 'right');
      for (let o = 0; o < r.length; o++) r[o].style.transformOrigin = `${n} ${i}`;
    }
    _calculateBoundingBoxRect(e, r) {
      let n = this._viewportRect,
        i = this._isRtl(),
        o,
        s,
        a;
      if (r.overlayY === 'top') (s = e.y), (o = n.height - s + this._viewportMargin);
      else if (r.overlayY === 'bottom') (a = n.height - e.y + this._viewportMargin * 2), (o = n.height - a + this._viewportMargin);
      else {
        let h = Math.min(n.bottom - e.y + n.top, e.y),
          g = this._lastBoundingBoxSize.height;
        (o = h * 2), (s = e.y - h), o > g && !this._isInitialRender && !this._growAfterOpen && (s = e.y - g / 2);
      }
      let c = (r.overlayX === 'start' && !i) || (r.overlayX === 'end' && i),
        l = (r.overlayX === 'end' && !i) || (r.overlayX === 'start' && i),
        u,
        d,
        f;
      if (l) (f = n.width - e.x + this._viewportMargin), (u = e.x - this._viewportMargin);
      else if (c) (d = e.x), (u = n.right - e.x);
      else {
        let h = Math.min(n.right - e.x + n.left, e.x),
          g = this._lastBoundingBoxSize.width;
        (u = h * 2), (d = e.x - h), u > g && !this._isInitialRender && !this._growAfterOpen && (d = e.x - g / 2);
      }
      return { top: s, left: d, bottom: a, right: f, width: u, height: o };
    }
    _setBoundingBoxStyles(e, r) {
      let n = this._calculateBoundingBoxRect(e, r);
      !this._isInitialRender &&
        !this._growAfterOpen &&
        ((n.height = Math.min(n.height, this._lastBoundingBoxSize.height)), (n.width = Math.min(n.width, this._lastBoundingBoxSize.width)));
      let i = {};
      if (this._hasExactPosition())
        (i.top = i.left = '0'), (i.bottom = i.right = i.maxHeight = i.maxWidth = ''), (i.width = i.height = '100%');
      else {
        let o = this._overlayRef.getConfig().maxHeight,
          s = this._overlayRef.getConfig().maxWidth;
        (i.height = ae(n.height)),
          (i.top = ae(n.top)),
          (i.bottom = ae(n.bottom)),
          (i.width = ae(n.width)),
          (i.left = ae(n.left)),
          (i.right = ae(n.right)),
          r.overlayX === 'center' ? (i.alignItems = 'center') : (i.alignItems = r.overlayX === 'end' ? 'flex-end' : 'flex-start'),
          r.overlayY === 'center'
            ? (i.justifyContent = 'center')
            : (i.justifyContent = r.overlayY === 'bottom' ? 'flex-end' : 'flex-start'),
          o && (i.maxHeight = ae(o)),
          s && (i.maxWidth = ae(s));
      }
      (this._lastBoundingBoxSize = n), vn(this._boundingBox.style, i);
    }
    _resetBoundingBoxStyles() {
      vn(this._boundingBox.style, {
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        height: '',
        width: '',
        alignItems: '',
        justifyContent: '',
      });
    }
    _resetOverlayElementStyles() {
      vn(this._pane.style, { top: '', left: '', bottom: '', right: '', position: '', transform: '' });
    }
    _setOverlayElementStyles(e, r) {
      let n = {},
        i = this._hasExactPosition(),
        o = this._hasFlexibleDimensions,
        s = this._overlayRef.getConfig();
      if (i) {
        let u = this._viewportRuler.getViewportScrollPosition();
        vn(n, this._getExactOverlayY(r, e, u)), vn(n, this._getExactOverlayX(r, e, u));
      } else n.position = 'static';
      let a = '',
        c = this._getOffset(r, 'x'),
        l = this._getOffset(r, 'y');
      c && (a += `translateX(${c}px) `),
        l && (a += `translateY(${l}px)`),
        (n.transform = a.trim()),
        s.maxHeight && (i ? (n.maxHeight = ae(s.maxHeight)) : o && (n.maxHeight = '')),
        s.maxWidth && (i ? (n.maxWidth = ae(s.maxWidth)) : o && (n.maxWidth = '')),
        vn(this._pane.style, n);
    }
    _getExactOverlayY(e, r, n) {
      let i = { top: '', bottom: '' },
        o = this._getOverlayPoint(r, this._overlayRect, e);
      if ((this._isPushed && (o = this._pushOverlayOnScreen(o, this._overlayRect, n)), e.overlayY === 'bottom')) {
        let s = this._document.documentElement.clientHeight;
        i.bottom = `${s - (o.y + this._overlayRect.height)}px`;
      } else i.top = ae(o.y);
      return i;
    }
    _getExactOverlayX(e, r, n) {
      let i = { left: '', right: '' },
        o = this._getOverlayPoint(r, this._overlayRect, e);
      this._isPushed && (o = this._pushOverlayOnScreen(o, this._overlayRect, n));
      let s;
      if ((this._isRtl() ? (s = e.overlayX === 'end' ? 'left' : 'right') : (s = e.overlayX === 'end' ? 'right' : 'left'), s === 'right')) {
        let a = this._document.documentElement.clientWidth;
        i.right = `${a - (o.x + this._overlayRect.width)}px`;
      } else i.left = ae(o.x);
      return i;
    }
    _getScrollVisibility() {
      let e = this._getOriginRect(),
        r = this._pane.getBoundingClientRect(),
        n = this._scrollables.map((i) => i.getElementRef().nativeElement.getBoundingClientRect());
      return { isOriginClipped: Xg(e, n), isOriginOutsideView: Au(e, n), isOverlayClipped: Xg(r, n), isOverlayOutsideView: Au(r, n) };
    }
    _subtractOverflows(e, ...r) {
      return r.reduce((n, i) => n - Math.max(i, 0), e);
    }
    _getNarrowedViewportRect() {
      let e = this._document.documentElement.clientWidth,
        r = this._document.documentElement.clientHeight,
        n = this._viewportRuler.getViewportScrollPosition();
      return {
        top: n.top + this._viewportMargin,
        left: n.left + this._viewportMargin,
        right: n.left + e - this._viewportMargin,
        bottom: n.top + r - this._viewportMargin,
        width: e - 2 * this._viewportMargin,
        height: r - 2 * this._viewportMargin,
      };
    }
    _isRtl() {
      return this._overlayRef.getDirection() === 'rtl';
    }
    _hasExactPosition() {
      return !this._hasFlexibleDimensions || this._isPushed;
    }
    _getOffset(e, r) {
      return r === 'x' ? (e.offsetX == null ? this._offsetX : e.offsetX) : e.offsetY == null ? this._offsetY : e.offsetY;
    }
    _validatePositions() {}
    _addPanelClasses(e) {
      this._pane &&
        _u(e).forEach((r) => {
          r !== '' && this._appliedPanelClasses.indexOf(r) === -1 && (this._appliedPanelClasses.push(r), this._pane.classList.add(r));
        });
    }
    _clearPanelClasses() {
      this._pane &&
        (this._appliedPanelClasses.forEach((e) => {
          this._pane.classList.remove(e);
        }),
        (this._appliedPanelClasses = []));
    }
    _getOriginRect() {
      let e = this._origin;
      if (e instanceof te) return e.nativeElement.getBoundingClientRect();
      if (e instanceof Element) return e.getBoundingClientRect();
      let r = e.width || 0,
        n = e.height || 0;
      return { top: e.y, bottom: e.y + n, left: e.x, right: e.x + r, height: n, width: r };
    }
  };
function vn(t, e) {
  for (let r in e) e.hasOwnProperty(r) && (t[r] = e[r]);
  return t;
}
function em(t) {
  if (typeof t != 'number' && t != null) {
    let [e, r] = t.split(p0);
    return !r || r === 'px' ? parseFloat(e) : null;
  }
  return t || null;
}
function tm(t) {
  return {
    top: Math.floor(t.top),
    right: Math.floor(t.right),
    bottom: Math.floor(t.bottom),
    left: Math.floor(t.left),
    width: Math.floor(t.width),
    height: Math.floor(t.height),
  };
}
var nm = 'cdk-global-overlay-wrapper',
  Nu = class {
    constructor() {
      (this._cssPosition = 'static'),
        (this._topOffset = ''),
        (this._bottomOffset = ''),
        (this._alignItems = ''),
        (this._xPosition = ''),
        (this._xOffset = ''),
        (this._width = ''),
        (this._height = ''),
        (this._isDisposed = !1);
    }
    attach(e) {
      let r = e.getConfig();
      (this._overlayRef = e),
        this._width && !r.width && e.updateSize({ width: this._width }),
        this._height && !r.height && e.updateSize({ height: this._height }),
        e.hostElement.classList.add(nm),
        (this._isDisposed = !1);
    }
    top(e = '') {
      return (this._bottomOffset = ''), (this._topOffset = e), (this._alignItems = 'flex-start'), this;
    }
    left(e = '') {
      return (this._xOffset = e), (this._xPosition = 'left'), this;
    }
    bottom(e = '') {
      return (this._topOffset = ''), (this._bottomOffset = e), (this._alignItems = 'flex-end'), this;
    }
    right(e = '') {
      return (this._xOffset = e), (this._xPosition = 'right'), this;
    }
    start(e = '') {
      return (this._xOffset = e), (this._xPosition = 'start'), this;
    }
    end(e = '') {
      return (this._xOffset = e), (this._xPosition = 'end'), this;
    }
    width(e = '') {
      return this._overlayRef ? this._overlayRef.updateSize({ width: e }) : (this._width = e), this;
    }
    height(e = '') {
      return this._overlayRef ? this._overlayRef.updateSize({ height: e }) : (this._height = e), this;
    }
    centerHorizontally(e = '') {
      return this.left(e), (this._xPosition = 'center'), this;
    }
    centerVertically(e = '') {
      return this.top(e), (this._alignItems = 'center'), this;
    }
    apply() {
      if (!this._overlayRef || !this._overlayRef.hasAttached()) return;
      let e = this._overlayRef.overlayElement.style,
        r = this._overlayRef.hostElement.style,
        n = this._overlayRef.getConfig(),
        { width: i, height: o, maxWidth: s, maxHeight: a } = n,
        c = (i === '100%' || i === '100vw') && (!s || s === '100%' || s === '100vw'),
        l = (o === '100%' || o === '100vh') && (!a || a === '100%' || a === '100vh'),
        u = this._xPosition,
        d = this._xOffset,
        f = this._overlayRef.getConfig().direction === 'rtl',
        h = '',
        g = '',
        w = '';
      c
        ? (w = 'flex-start')
        : u === 'center'
          ? ((w = 'center'), f ? (g = d) : (h = d))
          : f
            ? u === 'left' || u === 'end'
              ? ((w = 'flex-end'), (h = d))
              : (u === 'right' || u === 'start') && ((w = 'flex-start'), (g = d))
            : u === 'left' || u === 'start'
              ? ((w = 'flex-start'), (h = d))
              : (u === 'right' || u === 'end') && ((w = 'flex-end'), (g = d)),
        (e.position = this._cssPosition),
        (e.marginLeft = c ? '0' : h),
        (e.marginTop = l ? '0' : this._topOffset),
        (e.marginBottom = this._bottomOffset),
        (e.marginRight = c ? '0' : g),
        (r.justifyContent = w),
        (r.alignItems = l ? 'flex-start' : this._alignItems);
    }
    dispose() {
      if (this._isDisposed || !this._overlayRef) return;
      let e = this._overlayRef.overlayElement.style,
        r = this._overlayRef.hostElement,
        n = r.style;
      r.classList.remove(nm),
        (n.justifyContent = n.alignItems = e.marginTop = e.marginBottom = e.marginLeft = e.marginRight = e.position = ''),
        (this._overlayRef = null),
        (this._isDisposed = !0);
    }
  },
  g0 = (() => {
    let e = class e {
      constructor(n, i, o, s) {
        (this._viewportRuler = n), (this._document = i), (this._platform = o), (this._overlayContainer = s);
      }
      global() {
        return new Nu();
      }
      flexibleConnectedTo(n) {
        return new Ru(n, this._viewportRuler, this._document, this._platform, this._overlayContainer);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(Oi), p(B), p(Je), p(Ws));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  m0 = 0,
  _n = (() => {
    let e = class e {
      constructor(n, i, o, s, a, c, l, u, d, f, h, g) {
        (this.scrollStrategies = n),
          (this._overlayContainer = i),
          (this._componentFactoryResolver = o),
          (this._positionBuilder = s),
          (this._keyboardDispatcher = a),
          (this._injector = c),
          (this._ngZone = l),
          (this._document = u),
          (this._directionality = d),
          (this._location = f),
          (this._outsideClickDispatcher = h),
          (this._animationsModuleType = g);
      }
      create(n) {
        let i = this._createHostElement(),
          o = this._createPaneElement(i),
          s = this._createPortalOutlet(o),
          a = new Er(n);
        return (
          (a.direction = a.direction || this._directionality.value),
          new yn(
            s,
            i,
            o,
            a,
            this._ngZone,
            this._keyboardDispatcher,
            this._document,
            this._location,
            this._outsideClickDispatcher,
            this._animationsModuleType === 'NoopAnimations',
          )
        );
      }
      position() {
        return this._positionBuilder;
      }
      _createPaneElement(n) {
        let i = this._document.createElement('div');
        return (i.id = `cdk-overlay-${m0++}`), i.classList.add('cdk-overlay-pane'), n.appendChild(i), i;
      }
      _createHostElement() {
        let n = this._document.createElement('div');
        return this._overlayContainer.getContainerElement().appendChild(n), n;
      }
      _createPortalOutlet(n) {
        return (
          this._appRef || (this._appRef = this._injector.get(sn)),
          new Bs(n, this._componentFactoryResolver, this._appRef, this._injector, this._document)
        );
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(d0), p(Ws), p(Lt), p(g0), p(f0), p(ge), p(j), p(B), p(Cr), p(cn), p(h0), p(ah, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })(),
  v0 = [
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom' },
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' },
  ],
  im = new b('cdk-connected-overlay-scroll-strategy'),
  Fu = (() => {
    let e = class e {
      constructor(n) {
        this.elementRef = n;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(te));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [
          ['', 'cdk-overlay-origin', ''],
          ['', 'overlay-origin', ''],
          ['', 'cdkOverlayOrigin', ''],
        ],
        exportAs: ['cdkOverlayOrigin'],
        standalone: !0,
      }));
    let t = e;
    return t;
  })(),
  om = (() => {
    let e = class e {
      get offsetX() {
        return this._offsetX;
      }
      set offsetX(n) {
        (this._offsetX = n), this._position && this._updatePositionStrategy(this._position);
      }
      get offsetY() {
        return this._offsetY;
      }
      set offsetY(n) {
        (this._offsetY = n), this._position && this._updatePositionStrategy(this._position);
      }
      get disposeOnNavigation() {
        return this._disposeOnNavigation;
      }
      set disposeOnNavigation(n) {
        this._disposeOnNavigation = n;
      }
      constructor(n, i, o, s, a) {
        (this._overlay = n),
          (this._dir = a),
          (this._backdropSubscription = q.EMPTY),
          (this._attachSubscription = q.EMPTY),
          (this._detachSubscription = q.EMPTY),
          (this._positionSubscription = q.EMPTY),
          (this._disposeOnNavigation = !1),
          (this.viewportMargin = 0),
          (this.open = !1),
          (this.disableClose = !1),
          (this.hasBackdrop = !1),
          (this.lockPosition = !1),
          (this.flexibleDimensions = !1),
          (this.growAfterOpen = !1),
          (this.push = !1),
          (this.backdropClick = new U()),
          (this.positionChange = new U()),
          (this.attach = new U()),
          (this.detach = new U()),
          (this.overlayKeydown = new U()),
          (this.overlayOutsideClick = new U()),
          (this._templatePortal = new mn(i, o)),
          (this._scrollStrategyFactory = s),
          (this.scrollStrategy = this._scrollStrategyFactory());
      }
      get overlayRef() {
        return this._overlayRef;
      }
      get dir() {
        return this._dir ? this._dir.value : 'ltr';
      }
      ngOnDestroy() {
        this._attachSubscription.unsubscribe(),
          this._detachSubscription.unsubscribe(),
          this._backdropSubscription.unsubscribe(),
          this._positionSubscription.unsubscribe(),
          this._overlayRef && this._overlayRef.dispose();
      }
      ngOnChanges(n) {
        this._position &&
          (this._updatePositionStrategy(this._position),
          this._overlayRef.updateSize({ width: this.width, minWidth: this.minWidth, height: this.height, minHeight: this.minHeight }),
          n.origin && this.open && this._position.apply()),
          n.open && (this.open ? this._attachOverlay() : this._detachOverlay());
      }
      _createOverlay() {
        (!this.positions || !this.positions.length) && (this.positions = v0);
        let n = (this._overlayRef = this._overlay.create(this._buildConfig()));
        (this._attachSubscription = n.attachments().subscribe(() => this.attach.emit())),
          (this._detachSubscription = n.detachments().subscribe(() => this.detach.emit())),
          n.keydownEvents().subscribe((i) => {
            this.overlayKeydown.next(i), i.keyCode === 27 && !this.disableClose && !Hs(i) && (i.preventDefault(), this._detachOverlay());
          }),
          this._overlayRef.outsidePointerEvents().subscribe((i) => {
            this.overlayOutsideClick.next(i);
          });
      }
      _buildConfig() {
        let n = (this._position = this.positionStrategy || this._createPositionStrategy()),
          i = new Er({
            direction: this._dir,
            positionStrategy: n,
            scrollStrategy: this.scrollStrategy,
            hasBackdrop: this.hasBackdrop,
            disposeOnNavigation: this.disposeOnNavigation,
          });
        return (
          (this.width || this.width === 0) && (i.width = this.width),
          (this.height || this.height === 0) && (i.height = this.height),
          (this.minWidth || this.minWidth === 0) && (i.minWidth = this.minWidth),
          (this.minHeight || this.minHeight === 0) && (i.minHeight = this.minHeight),
          this.backdropClass && (i.backdropClass = this.backdropClass),
          this.panelClass && (i.panelClass = this.panelClass),
          i
        );
      }
      _updatePositionStrategy(n) {
        let i = this.positions.map((o) => ({
          originX: o.originX,
          originY: o.originY,
          overlayX: o.overlayX,
          overlayY: o.overlayY,
          offsetX: o.offsetX || this.offsetX,
          offsetY: o.offsetY || this.offsetY,
          panelClass: o.panelClass || void 0,
        }));
        return n
          .setOrigin(this._getFlexibleConnectedPositionStrategyOrigin())
          .withPositions(i)
          .withFlexibleDimensions(this.flexibleDimensions)
          .withPush(this.push)
          .withGrowAfterOpen(this.growAfterOpen)
          .withViewportMargin(this.viewportMargin)
          .withLockedPosition(this.lockPosition)
          .withTransformOriginOn(this.transformOriginSelector);
      }
      _createPositionStrategy() {
        let n = this._overlay.position().flexibleConnectedTo(this._getFlexibleConnectedPositionStrategyOrigin());
        return this._updatePositionStrategy(n), n;
      }
      _getFlexibleConnectedPositionStrategyOrigin() {
        return this.origin instanceof Fu ? this.origin.elementRef : this.origin;
      }
      _attachOverlay() {
        this._overlayRef ? (this._overlayRef.getConfig().hasBackdrop = this.hasBackdrop) : this._createOverlay(),
          this._overlayRef.hasAttached() || this._overlayRef.attach(this._templatePortal),
          this.hasBackdrop
            ? (this._backdropSubscription = this._overlayRef.backdropClick().subscribe((n) => {
                this.backdropClick.emit(n);
              }))
            : this._backdropSubscription.unsubscribe(),
          this._positionSubscription.unsubscribe(),
          this.positionChange.observers.length > 0 &&
            (this._positionSubscription = this._position.positionChanges
              .pipe(_a(() => this.positionChange.observers.length > 0))
              .subscribe((n) => {
                this.positionChange.emit(n), this.positionChange.observers.length === 0 && this._positionSubscription.unsubscribe();
              }));
      }
      _detachOverlay() {
        this._overlayRef && this._overlayRef.detach(), this._backdropSubscription.unsubscribe(), this._positionSubscription.unsubscribe();
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(_n), v(Qe), v(Fe), v(im), v(Cr, 8));
    }),
      (e.ɵdir = re({
        type: e,
        selectors: [
          ['', 'cdk-connected-overlay', ''],
          ['', 'connected-overlay', ''],
          ['', 'cdkConnectedOverlay', ''],
        ],
        inputs: {
          origin: ['cdkConnectedOverlayOrigin', 'origin'],
          positions: ['cdkConnectedOverlayPositions', 'positions'],
          positionStrategy: ['cdkConnectedOverlayPositionStrategy', 'positionStrategy'],
          offsetX: ['cdkConnectedOverlayOffsetX', 'offsetX'],
          offsetY: ['cdkConnectedOverlayOffsetY', 'offsetY'],
          width: ['cdkConnectedOverlayWidth', 'width'],
          height: ['cdkConnectedOverlayHeight', 'height'],
          minWidth: ['cdkConnectedOverlayMinWidth', 'minWidth'],
          minHeight: ['cdkConnectedOverlayMinHeight', 'minHeight'],
          backdropClass: ['cdkConnectedOverlayBackdropClass', 'backdropClass'],
          panelClass: ['cdkConnectedOverlayPanelClass', 'panelClass'],
          viewportMargin: ['cdkConnectedOverlayViewportMargin', 'viewportMargin'],
          scrollStrategy: ['cdkConnectedOverlayScrollStrategy', 'scrollStrategy'],
          open: ['cdkConnectedOverlayOpen', 'open'],
          disableClose: ['cdkConnectedOverlayDisableClose', 'disableClose'],
          transformOriginSelector: ['cdkConnectedOverlayTransformOriginOn', 'transformOriginSelector'],
          hasBackdrop: ['cdkConnectedOverlayHasBackdrop', 'hasBackdrop', Ue],
          lockPosition: ['cdkConnectedOverlayLockPosition', 'lockPosition', Ue],
          flexibleDimensions: ['cdkConnectedOverlayFlexibleDimensions', 'flexibleDimensions', Ue],
          growAfterOpen: ['cdkConnectedOverlayGrowAfterOpen', 'growAfterOpen', Ue],
          push: ['cdkConnectedOverlayPush', 'push', Ue],
          disposeOnNavigation: ['cdkConnectedOverlayDisposeOnNavigation', 'disposeOnNavigation', Ue],
        },
        outputs: {
          backdropClick: 'backdropClick',
          positionChange: 'positionChange',
          attach: 'attach',
          detach: 'detach',
          overlayKeydown: 'overlayKeydown',
          overlayOutsideClick: 'overlayOutsideClick',
        },
        exportAs: ['cdkConnectedOverlay'],
        standalone: !0,
        features: [rr, ye],
      }));
    let t = e;
    return t;
  })();
function y0(t) {
  return () => t.scrollStrategies.reposition();
}
var _0 = { provide: im, deps: [_n], useFactory: y0 },
  ku = (() => {
    let e = class e {};
    (e.ɵfac = function (i) {
      return new (i || e)();
    }),
      (e.ɵmod = se({ type: e })),
      (e.ɵinj = oe({ providers: [_n, _0], imports: [Ti, Us, Iu, Iu] }));
    let t = e;
    return t;
  })();
function Lu(t) {
  t || (ih(Lu), (t = _(nl)));
  let e = new R((r) => t.onDestroy(r.next.bind(r)));
  return (r) => r.pipe(nt(e));
}
var D0 = ['trigger'];
function C0(t, e) {
  if (t & 1) {
    let r = or();
    C(0, 'a', 7),
      X('click', function () {
        let o = Xn(r).$implicit,
          s = be(2);
        return Jn(s.selectOption(o));
      }),
      S(1),
      D();
  }
  if (t & 2) {
    let r = e.$implicit,
      n = be(2);
    A(1), Mt(' ', r[n.nameField], ' ');
  }
}
function w0(t, e) {
  t & 1 && (C(0, 'p'), S(1, 'No results found...'), D());
}
function b0(t, e) {
  if ((t & 1 && (C(0, 'div', 6), Et(1, C0, 2, 1, 'a', null, bt), Te(3, w0, 2, 0, 'p'), D()), t & 2)) {
    let r = be();
    A(1), It(r.filteredOptions), A(2), Vt(3, !r.filteredOptions || !r.filteredOptions.length ? 3 : -1);
  }
}
var am = (() => {
  let e = class e {
    constructor(n, i, o) {
      (this.viewportRuler = n),
        (this.changeDetectorRef = i),
        (this.platformId = o),
        (this.selectedValue = ''),
        (this.hasSearch = !1),
        (this.placeholder = ''),
        (this.searchPlaceholder = ''),
        (this.options = []),
        (this.nameField = ''),
        (this.valueField = ''),
        (this.onOptionSelect = new U()),
        (this.selectedOption = null),
        (this.showingOptions = !1),
        (this.filteredOptions = []),
        (this.parentWidth = 0),
        (this.onModelChange = () => {}),
        (this.ignoreClose = !1),
        (this.onTouched = () => {}),
        (this.isBrowser = !1),
        (this.isBrowser = cr(o)),
        this.viewportRuler
          .change()
          .pipe(Lu())
          .subscribe(() => {
            this.showingOptions && this.measureParentWidth();
          });
    }
    ngOnInit() {
      this.filteredOptions = this.options;
    }
    ngAfterViewInit() {
      this.measureParentWidth();
    }
    ngOnChanges() {
      if (((this.filteredOptions = this.options), this.selectedOption)) {
        let n = this.filteredOptions.find((i) => i[this.valueField] === this.selectedOption[this.valueField]);
        this.selectedValue = n ? n[this.nameField] : '';
      }
    }
    writeValue(n) {
      n != null
        ? ((this.selectedOption = this.options.find((i) => i[this.valueField] === n) || null),
          this.selectedOption && (this.selectedValue = this.selectedOption[this.nameField]))
        : ((this.selectedValue = ''), (this.selectedOption = null));
    }
    registerOnChange(n) {
      this.onModelChange = n;
    }
    registerOnTouched(n) {
      this.onTouched = n;
    }
    toggleDropdown() {
      this.isDisabled || (this.showingOptions ? this.hideOptions() : this.showOptions());
    }
    onSearch(n) {
      let i = n.target.value;
      this.filterOptions(i), this.showingOptions || this.showOptions();
    }
    showOptions() {
      (this.showingOptions = !0), this.measureParentWidth();
    }
    onBlur() {
      (this.ignoreClose = !0), this.onTouched();
    }
    hideOptions(n) {
      (!this.ignoreClose || n) && (this.showingOptions = !1);
    }
    selectOption(n = null) {
      (n && n.disabled !== void 0 && n.disabled) ||
        (n
          ? ((this.selectedOption = n),
            (this.selectedValue = ''),
            setTimeout(() => {
              (this.selectedValue = n[this.nameField]),
                this.onModelChange(n[this.valueField]),
                this.onOptionSelect.emit(n[this.valueField]),
                this.filterOptions('');
            }))
          : ((this.selectedOption = null), (this.selectedValue = ''), this.onModelChange(null), this.onOptionSelect.emit('')),
        (this.ignoreClose = !1),
        this.hideOptions(),
        this.onTouched());
    }
    filterOptions(n) {
      this.filteredOptions = this.options.filter((i) => i[this.nameField].toLowerCase().includes(n.toLowerCase()));
    }
    measureParentWidth() {
      if (this.isBrowser && this.trigger) {
        let n = this.trigger.nativeElement.getBoundingClientRect();
        (this.parentWidth = n.width), this.changeDetectorRef.markForCheck(), this.changeDetectorRef.detectChanges();
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(Oi), v(wt), v($e));
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['archangel-select']],
      viewQuery: function (i, o) {
        if ((i & 1 && ni(D0, 7), i & 2)) {
          let s;
          sr((s = ar())) && (o.trigger = s.first);
        }
      },
      inputs: {
        selectedValue: 'selectedValue',
        hasSearch: 'hasSearch',
        placeholder: 'placeholder',
        searchPlaceholder: 'searchPlaceholder',
        options: 'options',
        nameField: 'nameField',
        valueField: 'valueField',
        isDisabled: 'isDisabled',
      },
      outputs: { onOptionSelect: 'onOptionSelect' },
      standalone: !0,
      features: [Ne([{ provide: Mi, useExisting: _t(() => e), multi: !0 }]), ye, Q],
      decls: 7,
      vars: 12,
      consts: [
        ['cdkOverlayOrigin', ''],
        ['trigger', '', 'origin', 'cdkOverlayOrigin'],
        [1, 'input-wrapper'],
        [1, 'form-control', 3, 'disabled', 'ngModel', 'placeholder', 'ngModelChange', 'input', 'focus', 'blur', 'keydown.enter'],
        [1, 'click-overlay', 3, 'click'],
        [
          'cdkConnectedOverlay',
          '',
          'cdkConnectedOverlayHasBackdrop',
          '',
          'cdkConnectedOverlayBackdropClass',
          'cdk-overlay-transparent-backdrop',
          3,
          'cdkConnectedOverlayWidth',
          'cdkConnectedOverlayOrigin',
          'cdkConnectedOverlayOpen',
          'backdropClick',
        ],
        [1, 'dropdown-options'],
        [3, 'click'],
      ],
      template: function (i, o) {
        if (
          (i & 1 &&
            (C(0, 'div', 0, 1)(3, 'div', 2)(4, 'input', 3),
            X('ngModelChange', function (a) {
              return o.onModelChange(a);
            })('input', function (a) {
              return o.onSearch(a);
            })('focus', function () {
              return o.showOptions();
            })('blur', function () {
              return o.onBlur();
            })('keydown.enter', function () {
              return o.selectOption();
            }),
            D(),
            C(5, 'div', 4),
            X('click', function () {
              return o.toggleDropdown();
            }),
            D()()(),
            Te(6, b0, 4, 1, 'ng-template', 5),
            X('backdropClick', function () {
              return o.hideOptions(!0);
            })),
          i & 2)
        ) {
          let s = op(2);
          A(3),
            Pe('expanded', o.showingOptions),
            A(1),
            J('disabled', o.isDisabled)('ngModel', o.selectedValue)(
              'placeholder',
              o.hasSearch ? (o.showingOptions ? o.searchPlaceholder : o.placeholder || '') : o.placeholder,
            ),
            A(1),
            Pe('is-disabled', o.isDisabled)('has-search', o.hasSearch),
            A(1),
            J('cdkConnectedOverlayWidth', o.parentWidth)('cdkConnectedOverlayOrigin', s)('cdkConnectedOverlayOpen', o.showingOptions);
        }
      },
      dependencies: [ku, om, Fu, Vs, Ns, Ps, Si, js],
      styles: [
        '[_nghost-%COMP%]{display:block}.input-wrapper[_ngcontent-%COMP%]{position:relative}.input-wrapper[_ngcontent-%COMP%]:hover{cursor:pointer}.input-wrapper[_ngcontent-%COMP%]:hover   .form-control[_ngcontent-%COMP%]{border-color:var(--primary-color)}.input-wrapper.expanded[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{border-bottom-right-radius:0;border-bottom-left-radius:0;border-color:var(--black-color)}.input-wrapper[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]{padding-right:32px;transition:none;color:var(--white-color);font-weight:bolder}.input-wrapper[_ngcontent-%COMP%]   xo-icon[_ngcontent-%COMP%]{position:absolute;top:12px;right:20px}.input-wrapper[_ngcontent-%COMP%]   .click-overlay[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%}.input-wrapper[_ngcontent-%COMP%]   .click-overlay.has-search[_ngcontent-%COMP%]{pointer-events:none!important}.input-wrapper[_ngcontent-%COMP%]   .click-overlay.is-disabled[_ngcontent-%COMP%]{cursor:not-allowed}.dropdown-options[_ngcontent-%COMP%]{width:100%;max-height:270px;overflow-y:auto;display:flex;flex-direction:column;padding-bottom:6px;border:2px solid var(--black-color);border-bottom-left-radius:6px;border-bottom-right-radius:6px;background-color:var(--background-color);border-top:none}.dropdown-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%], .dropdown-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{padding:12px;color:var(--text-color);cursor:pointer;font-size:13px}.dropdown-options[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover, .dropdown-options[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover{background-color:var(--primary-color);color:var(--white-color);font-weight:bolder}.dropdown-options[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{padding:12px;color:var(--white-color)}',
      ],
    }));
  let t = e;
  return t;
})();
var ju = (() => {
  let e = class e {
    constructor(n) {
      this._platform = n;
    }
    isDisabled(n) {
      return n.hasAttribute('disabled');
    }
    isVisible(n) {
      return I0(n) && getComputedStyle(n).visibility === 'visible';
    }
    isTabbable(n) {
      if (!this._platform.isBrowser) return !1;
      let i = E0(N0(n));
      if (i && (cm(i) === -1 || !this.isVisible(i))) return !1;
      let o = n.nodeName.toLowerCase(),
        s = cm(n);
      return n.hasAttribute('contenteditable')
        ? s !== -1
        : o === 'iframe' || o === 'object' || (this._platform.WEBKIT && this._platform.IOS && !O0(n))
          ? !1
          : o === 'audio'
            ? n.hasAttribute('controls')
              ? s !== -1
              : !1
            : o === 'video'
              ? s === -1
                ? !1
                : s !== null
                  ? !0
                  : this._platform.FIREFOX || n.hasAttribute('controls')
              : n.tabIndex >= 0;
    }
    isFocusable(n, i) {
      return R0(n) && !this.isDisabled(n) && (i?.ignoreVisibility || this.isVisible(n));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p(Je));
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function E0(t) {
  try {
    return t.frameElement;
  } catch {
    return null;
  }
}
function I0(t) {
  return !!(t.offsetWidth || t.offsetHeight || (typeof t.getClientRects == 'function' && t.getClientRects().length));
}
function M0(t) {
  let e = t.nodeName.toLowerCase();
  return e === 'input' || e === 'select' || e === 'button' || e === 'textarea';
}
function S0(t) {
  return A0(t) && t.type == 'hidden';
}
function x0(t) {
  return T0(t) && t.hasAttribute('href');
}
function A0(t) {
  return t.nodeName.toLowerCase() == 'input';
}
function T0(t) {
  return t.nodeName.toLowerCase() == 'a';
}
function lm(t) {
  if (!t.hasAttribute('tabindex') || t.tabIndex === void 0) return !1;
  let e = t.getAttribute('tabindex');
  return !!(e && !isNaN(parseInt(e, 10)));
}
function cm(t) {
  if (!lm(t)) return null;
  let e = parseInt(t.getAttribute('tabindex') || '', 10);
  return isNaN(e) ? -1 : e;
}
function O0(t) {
  let e = t.nodeName.toLowerCase(),
    r = e === 'input' && t.type;
  return r === 'text' || r === 'password' || e === 'select' || e === 'textarea';
}
function R0(t) {
  return S0(t) ? !1 : M0(t) || x0(t) || t.hasAttribute('contenteditable') || lm(t);
}
function N0(t) {
  return (t.ownerDocument && t.ownerDocument.defaultView) || window;
}
var Vu = class {
    get enabled() {
      return this._enabled;
    }
    set enabled(e) {
      (this._enabled = e),
        this._startAnchor &&
          this._endAnchor &&
          (this._toggleAnchorTabIndex(e, this._startAnchor), this._toggleAnchorTabIndex(e, this._endAnchor));
    }
    constructor(e, r, n, i, o = !1) {
      (this._element = e),
        (this._checker = r),
        (this._ngZone = n),
        (this._document = i),
        (this._hasAttached = !1),
        (this.startAnchorListener = () => this.focusLastTabbableElement()),
        (this.endAnchorListener = () => this.focusFirstTabbableElement()),
        (this._enabled = !0),
        o || this.attachAnchors();
    }
    destroy() {
      let e = this._startAnchor,
        r = this._endAnchor;
      e && (e.removeEventListener('focus', this.startAnchorListener), e.remove()),
        r && (r.removeEventListener('focus', this.endAnchorListener), r.remove()),
        (this._startAnchor = this._endAnchor = null),
        (this._hasAttached = !1);
    }
    attachAnchors() {
      return this._hasAttached
        ? !0
        : (this._ngZone.runOutsideAngular(() => {
            this._startAnchor ||
              ((this._startAnchor = this._createAnchor()), this._startAnchor.addEventListener('focus', this.startAnchorListener)),
              this._endAnchor ||
                ((this._endAnchor = this._createAnchor()), this._endAnchor.addEventListener('focus', this.endAnchorListener));
          }),
          this._element.parentNode &&
            (this._element.parentNode.insertBefore(this._startAnchor, this._element),
            this._element.parentNode.insertBefore(this._endAnchor, this._element.nextSibling),
            (this._hasAttached = !0)),
          this._hasAttached);
    }
    focusInitialElementWhenReady(e) {
      return new Promise((r) => {
        this._executeOnStable(() => r(this.focusInitialElement(e)));
      });
    }
    focusFirstTabbableElementWhenReady(e) {
      return new Promise((r) => {
        this._executeOnStable(() => r(this.focusFirstTabbableElement(e)));
      });
    }
    focusLastTabbableElementWhenReady(e) {
      return new Promise((r) => {
        this._executeOnStable(() => r(this.focusLastTabbableElement(e)));
      });
    }
    _getRegionBoundary(e) {
      let r = this._element.querySelectorAll(`[cdk-focus-region-${e}], [cdkFocusRegion${e}], [cdk-focus-${e}]`);
      return e == 'start'
        ? r.length
          ? r[0]
          : this._getFirstTabbableElement(this._element)
        : r.length
          ? r[r.length - 1]
          : this._getLastTabbableElement(this._element);
    }
    focusInitialElement(e) {
      let r = this._element.querySelector('[cdk-focus-initial], [cdkFocusInitial]');
      if (r) {
        if (!this._checker.isFocusable(r)) {
          let n = this._getFirstTabbableElement(r);
          return n?.focus(e), !!n;
        }
        return r.focus(e), !0;
      }
      return this.focusFirstTabbableElement(e);
    }
    focusFirstTabbableElement(e) {
      let r = this._getRegionBoundary('start');
      return r && r.focus(e), !!r;
    }
    focusLastTabbableElement(e) {
      let r = this._getRegionBoundary('end');
      return r && r.focus(e), !!r;
    }
    hasAttached() {
      return this._hasAttached;
    }
    _getFirstTabbableElement(e) {
      if (this._checker.isFocusable(e) && this._checker.isTabbable(e)) return e;
      let r = e.children;
      for (let n = 0; n < r.length; n++) {
        let i = r[n].nodeType === this._document.ELEMENT_NODE ? this._getFirstTabbableElement(r[n]) : null;
        if (i) return i;
      }
      return null;
    }
    _getLastTabbableElement(e) {
      if (this._checker.isFocusable(e) && this._checker.isTabbable(e)) return e;
      let r = e.children;
      for (let n = r.length - 1; n >= 0; n--) {
        let i = r[n].nodeType === this._document.ELEMENT_NODE ? this._getLastTabbableElement(r[n]) : null;
        if (i) return i;
      }
      return null;
    }
    _createAnchor() {
      let e = this._document.createElement('div');
      return (
        this._toggleAnchorTabIndex(this._enabled, e),
        e.classList.add('cdk-visually-hidden'),
        e.classList.add('cdk-focus-trap-anchor'),
        e.setAttribute('aria-hidden', 'true'),
        e
      );
    }
    _toggleAnchorTabIndex(e, r) {
      e ? r.setAttribute('tabindex', '0') : r.removeAttribute('tabindex');
    }
    toggleAnchors(e) {
      this._startAnchor &&
        this._endAnchor &&
        (this._toggleAnchorTabIndex(e, this._startAnchor), this._toggleAnchorTabIndex(e, this._endAnchor));
    }
    _executeOnStable(e) {
      this._ngZone.isStable ? e() : this._ngZone.onStable.pipe(me(1)).subscribe(e);
    }
  },
  um = (() => {
    let e = class e {
      constructor(n, i, o) {
        (this._checker = n), (this._ngZone = i), (this._document = o);
      }
      create(n, i = !1) {
        return new Vu(n, this._checker, this._ngZone, this._document, i);
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(ju), p(j), p(B));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function P0(t) {
  return t.buttons === 0 || t.detail === 0;
}
function F0(t) {
  let e = (t.touches && t.touches[0]) || (t.changedTouches && t.changedTouches[0]);
  return !!e && e.identifier === -1 && (e.radiusX == null || e.radiusX === 1) && (e.radiusY == null || e.radiusY === 1);
}
var k0 = new b('cdk-input-modality-detector-options'),
  L0 = { ignoreKeys: [18, 17, 224, 91, 16] },
  dm = 650,
  Ir = wu({ passive: !0, capture: !0 }),
  V0 = (() => {
    let e = class e {
      get mostRecentModality() {
        return this._modality.value;
      }
      constructor(n, i, o, s) {
        (this._platform = n),
          (this._mostRecentTarget = null),
          (this._modality = new le(null)),
          (this._lastTouchMs = 0),
          (this._onKeydown = (a) => {
            this._options?.ignoreKeys?.some((c) => c === a.keyCode) || (this._modality.next('keyboard'), (this._mostRecentTarget = xt(a)));
          }),
          (this._onMousedown = (a) => {
            Date.now() - this._lastTouchMs < dm || (this._modality.next(P0(a) ? 'keyboard' : 'mouse'), (this._mostRecentTarget = xt(a)));
          }),
          (this._onTouchstart = (a) => {
            if (F0(a)) {
              this._modality.next('keyboard');
              return;
            }
            (this._lastTouchMs = Date.now()), this._modality.next('touch'), (this._mostRecentTarget = xt(a));
          }),
          (this._options = m(m({}, L0), s)),
          (this.modalityDetected = this._modality.pipe(ya(1))),
          (this.modalityChanged = this.modalityDetected.pipe(Fn())),
          n.isBrowser &&
            i.runOutsideAngular(() => {
              o.addEventListener('keydown', this._onKeydown, Ir),
                o.addEventListener('mousedown', this._onMousedown, Ir),
                o.addEventListener('touchstart', this._onTouchstart, Ir);
            });
      }
      ngOnDestroy() {
        this._modality.complete(),
          this._platform.isBrowser &&
            (document.removeEventListener('keydown', this._onKeydown, Ir),
            document.removeEventListener('mousedown', this._onMousedown, Ir),
            document.removeEventListener('touchstart', this._onTouchstart, Ir));
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(Je), p(j), p(B), p(k0, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
var j0 = new b('cdk-focus-monitor-default-options'),
  Gs = wu({ passive: !0, capture: !0 }),
  fm = (() => {
    let e = class e {
      constructor(n, i, o, s, a) {
        (this._ngZone = n),
          (this._platform = i),
          (this._inputModalityDetector = o),
          (this._origin = null),
          (this._windowFocused = !1),
          (this._originFromTouchInteraction = !1),
          (this._elementInfo = new Map()),
          (this._monitoredElementCount = 0),
          (this._rootNodeFocusListenerCount = new Map()),
          (this._windowFocusListener = () => {
            (this._windowFocused = !0), (this._windowFocusTimeoutId = window.setTimeout(() => (this._windowFocused = !1)));
          }),
          (this._stopInputModalityDetector = new $()),
          (this._rootNodeFocusAndBlurListener = (c) => {
            let l = xt(c);
            for (let u = l; u; u = u.parentElement) c.type === 'focus' ? this._onFocus(c, u) : this._onBlur(c, u);
          }),
          (this._document = s),
          (this._detectionMode = a?.detectionMode || 0);
      }
      monitor(n, i = !1) {
        let o = Dr(n);
        if (!this._platform.isBrowser || o.nodeType !== 1) return I();
        let s = qg(o) || this._getDocument(),
          a = this._elementInfo.get(o);
        if (a) return i && (a.checkChildren = !0), a.subject;
        let c = { checkChildren: i, subject: new $(), rootNode: s };
        return this._elementInfo.set(o, c), this._registerGlobalListeners(c), c.subject;
      }
      stopMonitoring(n) {
        let i = Dr(n),
          o = this._elementInfo.get(i);
        o && (o.subject.complete(), this._setClasses(i), this._elementInfo.delete(i), this._removeGlobalListeners(o));
      }
      focusVia(n, i, o) {
        let s = Dr(n),
          a = this._getDocument().activeElement;
        s === a
          ? this._getClosestElementsInfo(s).forEach(([c, l]) => this._originChanged(c, i, l))
          : (this._setOrigin(i), typeof s.focus == 'function' && s.focus(o));
      }
      ngOnDestroy() {
        this._elementInfo.forEach((n, i) => this.stopMonitoring(i));
      }
      _getDocument() {
        return this._document || document;
      }
      _getWindow() {
        return this._getDocument().defaultView || window;
      }
      _getFocusOrigin(n) {
        return this._origin
          ? this._originFromTouchInteraction
            ? this._shouldBeAttributedToTouch(n)
              ? 'touch'
              : 'program'
            : this._origin
          : this._windowFocused && this._lastFocusOrigin
            ? this._lastFocusOrigin
            : n && this._isLastInteractionFromInputLabel(n)
              ? 'mouse'
              : 'program';
      }
      _shouldBeAttributedToTouch(n) {
        return this._detectionMode === 1 || !!n?.contains(this._inputModalityDetector._mostRecentTarget);
      }
      _setClasses(n, i) {
        n.classList.toggle('cdk-focused', !!i),
          n.classList.toggle('cdk-touch-focused', i === 'touch'),
          n.classList.toggle('cdk-keyboard-focused', i === 'keyboard'),
          n.classList.toggle('cdk-mouse-focused', i === 'mouse'),
          n.classList.toggle('cdk-program-focused', i === 'program');
      }
      _setOrigin(n, i = !1) {
        this._ngZone.runOutsideAngular(() => {
          if (((this._origin = n), (this._originFromTouchInteraction = n === 'touch' && i), this._detectionMode === 0)) {
            clearTimeout(this._originTimeoutId);
            let o = this._originFromTouchInteraction ? dm : 1;
            this._originTimeoutId = setTimeout(() => (this._origin = null), o);
          }
        });
      }
      _onFocus(n, i) {
        let o = this._elementInfo.get(i),
          s = xt(n);
        !o || (!o.checkChildren && i !== s) || this._originChanged(i, this._getFocusOrigin(s), o);
      }
      _onBlur(n, i) {
        let o = this._elementInfo.get(i);
        !o ||
          (o.checkChildren && n.relatedTarget instanceof Node && i.contains(n.relatedTarget)) ||
          (this._setClasses(i), this._emitOrigin(o, null));
      }
      _emitOrigin(n, i) {
        n.subject.observers.length && this._ngZone.run(() => n.subject.next(i));
      }
      _registerGlobalListeners(n) {
        if (!this._platform.isBrowser) return;
        let i = n.rootNode,
          o = this._rootNodeFocusListenerCount.get(i) || 0;
        o ||
          this._ngZone.runOutsideAngular(() => {
            i.addEventListener('focus', this._rootNodeFocusAndBlurListener, Gs),
              i.addEventListener('blur', this._rootNodeFocusAndBlurListener, Gs);
          }),
          this._rootNodeFocusListenerCount.set(i, o + 1),
          ++this._monitoredElementCount === 1 &&
            (this._ngZone.runOutsideAngular(() => {
              this._getWindow().addEventListener('focus', this._windowFocusListener);
            }),
            this._inputModalityDetector.modalityDetected.pipe(nt(this._stopInputModalityDetector)).subscribe((s) => {
              this._setOrigin(s, !0);
            }));
      }
      _removeGlobalListeners(n) {
        let i = n.rootNode;
        if (this._rootNodeFocusListenerCount.has(i)) {
          let o = this._rootNodeFocusListenerCount.get(i);
          o > 1
            ? this._rootNodeFocusListenerCount.set(i, o - 1)
            : (i.removeEventListener('focus', this._rootNodeFocusAndBlurListener, Gs),
              i.removeEventListener('blur', this._rootNodeFocusAndBlurListener, Gs),
              this._rootNodeFocusListenerCount.delete(i));
        }
        --this._monitoredElementCount ||
          (this._getWindow().removeEventListener('focus', this._windowFocusListener),
          this._stopInputModalityDetector.next(),
          clearTimeout(this._windowFocusTimeoutId),
          clearTimeout(this._originTimeoutId));
      }
      _originChanged(n, i, o) {
        this._setClasses(n, i), this._emitOrigin(o, i), (this._lastFocusOrigin = i);
      }
      _getClosestElementsInfo(n) {
        let i = [];
        return (
          this._elementInfo.forEach((o, s) => {
            (s === n || (o.checkChildren && s.contains(n))) && i.push([s, o]);
          }),
          i
        );
      }
      _isLastInteractionFromInputLabel(n) {
        let { _mostRecentTarget: i, mostRecentModality: o } = this._inputModalityDetector;
        if (o !== 'mouse' || !i || i === n || (n.nodeName !== 'INPUT' && n.nodeName !== 'TEXTAREA') || n.disabled) return !1;
        let s = n.labels;
        if (s) {
          for (let a = 0; a < s.length; a++) if (s[a].contains(i)) return !0;
        }
        return !1;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(j), p(Je), p(V0), p(B, 8), p(j0, 8));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function $0(t, e) {}
var Ni = class {
  constructor() {
    (this.role = 'dialog'),
      (this.panelClass = ''),
      (this.hasBackdrop = !0),
      (this.backdropClass = ''),
      (this.disableClose = !1),
      (this.width = ''),
      (this.height = ''),
      (this.data = null),
      (this.ariaDescribedBy = null),
      (this.ariaLabelledBy = null),
      (this.ariaLabel = null),
      (this.ariaModal = !0),
      (this.autoFocus = 'first-tabbable'),
      (this.restoreFocus = !0),
      (this.closeOnNavigation = !0),
      (this.closeOnDestroy = !0),
      (this.closeOnOverlayDetachments = !0);
  }
};
var U0 = (() => {
    let e = class e extends br {
      constructor(n, i, o, s, a, c, l, u) {
        super(),
          (this._elementRef = n),
          (this._focusTrapFactory = i),
          (this._config = s),
          (this._interactivityChecker = a),
          (this._ngZone = c),
          (this._overlayRef = l),
          (this._focusMonitor = u),
          (this._elementFocusedBeforeDialogWasOpened = null),
          (this._closeInteractionType = null),
          (this._ariaLabelledByQueue = []),
          (this.attachDomPortal = (d) => {
            this._portalOutlet.hasAttached();
            let f = this._portalOutlet.attachDomPortal(d);
            return this._contentAttached(), f;
          }),
          (this._document = o),
          this._config.ariaLabelledBy && this._ariaLabelledByQueue.push(this._config.ariaLabelledBy);
      }
      _contentAttached() {
        this._initializeFocusTrap(), this._handleBackdropClicks(), this._captureInitialFocus();
      }
      _captureInitialFocus() {
        this._trapFocus();
      }
      ngOnDestroy() {
        this._restoreFocus();
      }
      attachComponentPortal(n) {
        this._portalOutlet.hasAttached();
        let i = this._portalOutlet.attachComponentPortal(n);
        return this._contentAttached(), i;
      }
      attachTemplatePortal(n) {
        this._portalOutlet.hasAttached();
        let i = this._portalOutlet.attachTemplatePortal(n);
        return this._contentAttached(), i;
      }
      _recaptureFocus() {
        this._containsFocus() || this._trapFocus();
      }
      _forceFocus(n, i) {
        this._interactivityChecker.isFocusable(n) ||
          ((n.tabIndex = -1),
          this._ngZone.runOutsideAngular(() => {
            let o = () => {
              n.removeEventListener('blur', o), n.removeEventListener('mousedown', o), n.removeAttribute('tabindex');
            };
            n.addEventListener('blur', o), n.addEventListener('mousedown', o);
          })),
          n.focus(i);
      }
      _focusByCssSelector(n, i) {
        let o = this._elementRef.nativeElement.querySelector(n);
        o && this._forceFocus(o, i);
      }
      _trapFocus() {
        let n = this._elementRef.nativeElement;
        switch (this._config.autoFocus) {
          case !1:
          case 'dialog':
            this._containsFocus() || n.focus();
            break;
          case !0:
          case 'first-tabbable':
            this._focusTrap.focusInitialElementWhenReady().then((i) => {
              i || this._focusDialogContainer();
            });
            break;
          case 'first-heading':
            this._focusByCssSelector('h1, h2, h3, h4, h5, h6, [role="heading"]');
            break;
          default:
            this._focusByCssSelector(this._config.autoFocus);
            break;
        }
      }
      _restoreFocus() {
        let n = this._config.restoreFocus,
          i = null;
        if (
          (typeof n == 'string'
            ? (i = this._document.querySelector(n))
            : typeof n == 'boolean'
              ? (i = n ? this._elementFocusedBeforeDialogWasOpened : null)
              : n && (i = n),
          this._config.restoreFocus && i && typeof i.focus == 'function')
        ) {
          let o = Ai(),
            s = this._elementRef.nativeElement;
          (!o || o === this._document.body || o === s || s.contains(o)) &&
            (this._focusMonitor
              ? (this._focusMonitor.focusVia(i, this._closeInteractionType), (this._closeInteractionType = null))
              : i.focus());
        }
        this._focusTrap && this._focusTrap.destroy();
      }
      _focusDialogContainer() {
        this._elementRef.nativeElement.focus && this._elementRef.nativeElement.focus();
      }
      _containsFocus() {
        let n = this._elementRef.nativeElement,
          i = Ai();
        return n === i || n.contains(i);
      }
      _initializeFocusTrap() {
        (this._focusTrap = this._focusTrapFactory.create(this._elementRef.nativeElement)),
          this._document && (this._elementFocusedBeforeDialogWasOpened = Ai());
      }
      _handleBackdropClicks() {
        this._overlayRef.backdropClick().subscribe(() => {
          this._config.disableClose && this._recaptureFocus();
        });
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(v(te), v(um), v(B, 8), v(Ni), v(ju), v(j), v(yn), v(fm));
    }),
      (e.ɵcmp = K({
        type: e,
        selectors: [['cdk-dialog-container']],
        viewQuery: function (i, o) {
          if ((i & 1 && ni($s, 7), i & 2)) {
            let s;
            sr((s = ar())) && (o._portalOutlet = s.first);
          }
        },
        hostAttrs: ['tabindex', '-1', 1, 'cdk-dialog-container'],
        hostVars: 6,
        hostBindings: function (i, o) {
          i & 2 &&
            ir('id', o._config.id || null)('role', o._config.role)('aria-modal', o._config.ariaModal)(
              'aria-labelledby',
              o._config.ariaLabel ? null : o._ariaLabelledByQueue[0],
            )('aria-label', o._config.ariaLabel)('aria-describedby', o._config.ariaDescribedBy || null);
        },
        standalone: !0,
        features: [Re, Q],
        decls: 1,
        vars: 0,
        consts: [['cdkPortalOutlet', '']],
        template: function (i, o) {
          i & 1 && Te(0, $0, 0, 0, 'ng-template', 0);
        },
        dependencies: [Us, $s],
        styles: ['.cdk-dialog-container{display:block;width:100%;height:100%;min-height:inherit;max-height:inherit}'],
        encapsulation: 2,
      }));
    let t = e;
    return t;
  })(),
  At = class {
    constructor(e, r) {
      (this.overlayRef = e),
        (this.config = r),
        (this.closed = new $()),
        (this.disableClose = r.disableClose),
        (this.backdropClick = e.backdropClick()),
        (this.keydownEvents = e.keydownEvents()),
        (this.outsidePointerEvents = e.outsidePointerEvents()),
        (this.id = r.id),
        this.keydownEvents.subscribe((n) => {
          n.keyCode === 27 && !this.disableClose && !Hs(n) && (n.preventDefault(), this.close(void 0, { focusOrigin: 'keyboard' }));
        }),
        this.backdropClick.subscribe(() => {
          this.disableClose || this.close(void 0, { focusOrigin: 'mouse' });
        }),
        (this._detachSubscription = e.detachments().subscribe(() => {
          r.closeOnOverlayDetachments !== !1 && this.close();
        }));
    }
    close(e, r) {
      if (this.containerInstance) {
        let n = this.closed;
        (this.containerInstance._closeInteractionType = r?.focusOrigin || 'program'),
          this._detachSubscription.unsubscribe(),
          this.overlayRef.dispose(),
          n.next(e),
          n.complete(),
          (this.componentInstance = this.containerInstance = null);
      }
    }
    updatePosition() {
      return this.overlayRef.updatePosition(), this;
    }
    updateSize(e = '', r = '') {
      return this.overlayRef.updateSize({ width: e, height: r }), this;
    }
    addPanelClass(e) {
      return this.overlayRef.addPanelClass(e), this;
    }
    removePanelClass(e) {
      return this.overlayRef.removePanelClass(e), this;
    }
  },
  H0 = new b('DialogScrollStrategy', {
    providedIn: 'root',
    factory: () => {
      let t = _(_n);
      return () => t.scrollStrategies.block();
    },
  }),
  Pi = new b('DialogData'),
  z0 = new b('DefaultDialogConfig');
var W0 = 0,
  qs = (() => {
    let e = class e {
      get openDialogs() {
        return this._parentDialog ? this._parentDialog.openDialogs : this._openDialogsAtThisLevel;
      }
      get afterOpened() {
        return this._parentDialog ? this._parentDialog.afterOpened : this._afterOpenedAtThisLevel;
      }
      constructor(n, i, o, s, a, c) {
        (this._overlay = n),
          (this._injector = i),
          (this._defaultOptions = o),
          (this._parentDialog = s),
          (this._overlayContainer = a),
          (this._openDialogsAtThisLevel = []),
          (this._afterAllClosedAtThisLevel = new $()),
          (this._afterOpenedAtThisLevel = new $()),
          (this._ariaHiddenElements = new Map()),
          (this.afterAllClosed = Nn(() =>
            this.openDialogs.length ? this._getAfterAllClosed() : this._getAfterAllClosed().pipe(Ln(void 0)),
          )),
          (this._scrollStrategy = c);
      }
      open(n, i) {
        let o = this._defaultOptions || new Ni();
        (i = m(m({}, o), i)), (i.id = i.id || `cdk-dialog-${W0++}`), i.id && this.getDialogById(i.id);
        let s = this._getOverlayConfig(i),
          a = this._overlay.create(s),
          c = new At(a, i),
          l = this._attachContainer(a, c, i);
        return (
          (c.containerInstance = l),
          this._attachDialogContent(n, c, l, i),
          this.openDialogs.length || this._hideNonDialogContentFromAssistiveTechnology(),
          this.openDialogs.push(c),
          c.closed.subscribe(() => this._removeOpenDialog(c, !0)),
          this.afterOpened.next(c),
          c
        );
      }
      closeAll() {
        Bu(this.openDialogs, (n) => n.close());
      }
      getDialogById(n) {
        return this.openDialogs.find((i) => i.id === n);
      }
      ngOnDestroy() {
        Bu(this._openDialogsAtThisLevel, (n) => {
          n.config.closeOnDestroy === !1 && this._removeOpenDialog(n, !1);
        }),
          Bu(this._openDialogsAtThisLevel, (n) => n.close()),
          this._afterAllClosedAtThisLevel.complete(),
          this._afterOpenedAtThisLevel.complete(),
          (this._openDialogsAtThisLevel = []);
      }
      _getOverlayConfig(n) {
        let i = new Er({
          positionStrategy: n.positionStrategy || this._overlay.position().global().centerHorizontally().centerVertically(),
          scrollStrategy: n.scrollStrategy || this._scrollStrategy(),
          panelClass: n.panelClass,
          hasBackdrop: n.hasBackdrop,
          direction: n.direction,
          minWidth: n.minWidth,
          minHeight: n.minHeight,
          maxWidth: n.maxWidth,
          maxHeight: n.maxHeight,
          width: n.width,
          height: n.height,
          disposeOnNavigation: n.closeOnNavigation,
        });
        return n.backdropClass && (i.backdropClass = n.backdropClass), i;
      }
      _attachContainer(n, i, o) {
        let s = o.injector || o.viewContainerRef?.injector,
          a = [
            { provide: Ni, useValue: o },
            { provide: At, useValue: i },
            { provide: yn, useValue: n },
          ],
          c;
        o.container
          ? typeof o.container == 'function'
            ? (c = o.container)
            : ((c = o.container.type), a.push(...o.container.providers(o)))
          : (c = U0);
        let l = new wr(c, o.viewContainerRef, ge.create({ parent: s || this._injector, providers: a }), o.componentFactoryResolver);
        return n.attach(l).instance;
      }
      _attachDialogContent(n, i, o, s) {
        if (n instanceof Qe) {
          let a = this._createInjector(s, i, o, void 0),
            c = { $implicit: s.data, dialogRef: i };
          s.templateContext && (c = m(m({}, c), typeof s.templateContext == 'function' ? s.templateContext() : s.templateContext)),
            o.attachTemplatePortal(new mn(n, null, c, a));
        } else {
          let a = this._createInjector(s, i, o, this._injector),
            c = o.attachComponentPortal(new wr(n, s.viewContainerRef, a, s.componentFactoryResolver));
          (i.componentRef = c), (i.componentInstance = c.instance);
        }
      }
      _createInjector(n, i, o, s) {
        let a = n.injector || n.viewContainerRef?.injector,
          c = [
            { provide: Pi, useValue: n.data },
            { provide: At, useValue: i },
          ];
        return (
          n.providers && (typeof n.providers == 'function' ? c.push(...n.providers(i, n, o)) : c.push(...n.providers)),
          n.direction &&
            (!a || !a.get(Cr, null, { optional: !0 })) &&
            c.push({ provide: Cr, useValue: { value: n.direction, change: I() } }),
          ge.create({ parent: a || s, providers: c })
        );
      }
      _removeOpenDialog(n, i) {
        let o = this.openDialogs.indexOf(n);
        o > -1 &&
          (this.openDialogs.splice(o, 1),
          this.openDialogs.length ||
            (this._ariaHiddenElements.forEach((s, a) => {
              s ? a.setAttribute('aria-hidden', s) : a.removeAttribute('aria-hidden');
            }),
            this._ariaHiddenElements.clear(),
            i && this._getAfterAllClosed().next()));
      }
      _hideNonDialogContentFromAssistiveTechnology() {
        let n = this._overlayContainer.getContainerElement();
        if (n.parentElement) {
          let i = n.parentElement.children;
          for (let o = i.length - 1; o > -1; o--) {
            let s = i[o];
            s !== n &&
              s.nodeName !== 'SCRIPT' &&
              s.nodeName !== 'STYLE' &&
              !s.hasAttribute('aria-live') &&
              (this._ariaHiddenElements.set(s, s.getAttribute('aria-hidden')), s.setAttribute('aria-hidden', 'true'));
          }
        }
      }
      _getAfterAllClosed() {
        let n = this._parentDialog;
        return n ? n._getAfterAllClosed() : this._afterAllClosedAtThisLevel;
      }
    };
    (e.ɵfac = function (i) {
      return new (i || e)(p(_n), p(ge), p(z0, 8), p(e, 12), p(Ws), p(H0));
    }),
      (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
    let t = e;
    return t;
  })();
function Bu(t, e) {
  let r = t.length;
  for (; r--; ) e(t[r]);
}
var hm = (() => {
  let e = class e {
    constructor(n, i) {
      (this.data = n), (this.dialogRef = i);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(Pi), v(At));
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['archangel-notification']],
      standalone: !0,
      features: [Q],
      decls: 9,
      vars: 3,
      consts: [
        [1, 'dialog-wrapper'],
        [1, 'dialog-content'],
        [1, 'mb-3'],
        [1, 'mb-4', 'mb-md-3'],
        [1, 'footer'],
        ['type', 'button', 'archangelButton', '', 'color', 'black', 3, 'rounded', 'border', 'click'],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'div', 1)(2, 'h5', 2),
          S(3, 'Notification'),
          D(),
          C(4, 'p', 3),
          S(5),
          D(),
          C(6, 'div', 4)(7, 'button', 5),
          X('click', function () {
            return o.dialogRef.close();
          }),
          S(8, ' Close '),
          D()()()()),
          i & 2 && (A(5), ei(o.data.text), A(2), J('rounded', !0)('border', !0));
      },
      dependencies: [ft],
      styles: ['.footer[_ngcontent-%COMP%]{display:flex;justify-content:end}'],
    }));
  let t = e;
  return t;
})();
var pm = (() => {
  let e = class e {
    constructor(n, i) {
      (this.data = n), (this.dialogRef = i);
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(Pi), v(At));
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['archangel-confirmation']],
      standalone: !0,
      features: [Q],
      decls: 11,
      vars: 7,
      consts: [
        [1, 'dialog-wrapper'],
        [1, 'dialog-content'],
        [1, 'mb-3'],
        [1, 'mb-5'],
        [1, 'footer'],
        ['type', 'button', 'archangelButton', '', 'color', 'primary', 1, 'mr-2', 3, 'rounded', 'border', 'click'],
        ['type', 'button', 'archangelButton', '', 'color', 'black', 3, 'rounded', 'border', 'click'],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'div', 1)(2, 'h5', 2),
          S(3, 'Confirmation'),
          D(),
          C(4, 'p', 3),
          S(5),
          D(),
          C(6, 'div', 4)(7, 'button', 5),
          X('click', function () {
            return o.dialogRef.close(!1);
          }),
          S(8),
          D(),
          C(9, 'button', 6),
          X('click', function () {
            return o.dialogRef.close(!0);
          }),
          S(10),
          D()()()()),
          i & 2 &&
            (A(5),
            ei(o.data.text),
            A(2),
            J('rounded', !0)('border', !0),
            A(1),
            Mt(' ', o.data.cancelText, ' '),
            A(1),
            J('rounded', !0)('border', !0),
            A(1),
            Mt(' ', o.data.submitText, ' '));
      },
      dependencies: [ft],
      styles: ['.footer[_ngcontent-%COMP%]{display:flex;justify-content:end}'],
    }));
  let t = e;
  return t;
})();
var Ut = (() => {
  let e = class e {
    constructor(n) {
      this.dialog = n;
    }
    show(n) {
      this.dialog.open(hm, { disableClose: !0, closeOnNavigation: !0, data: { text: n } });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p(qs));
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
var Zs = (() => {
  let e = class e {
    constructor(n) {
      this.dialog = n;
    }
    show(n, i, o) {
      return this.dialog.open(pm, { disableClose: !0, closeOnNavigation: !0, data: { text: n, submitText: i, cancelText: o } });
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(p(qs));
  }),
    (e.ɵprov = y({ token: e, factory: e.ɵfac, providedIn: 'root' }));
  let t = e;
  return t;
})();
function G0(t, e) {
  if ((t & 1 && (C(0, 'span', 5), S(1), D()), t & 2)) {
    let r = be().$implicit,
      n = be(2);
    Pe('light', r.month !== n.month), A(1), Mt(' ', r.number, ' ');
  }
}
function q0(t, e) {
  if ((t & 1 && (C(0, 'div', 2), Te(1, G0, 2, 3, 'span', 4), D()), t & 2)) {
    let r = e.$implicit;
    Pe('disabled', !r), A(1), Vt(1, r ? 1 : -1);
  }
}
function Y0(t, e) {
  if ((t & 1 && (C(0, 'div', 3), Et(1, q0, 2, 3, 'div', 6, bt), D()), t & 2)) {
    let r = e.$implicit;
    A(1), It(r);
  }
}
var gm = (() => {
  let e = class e {
    constructor() {
      (this.month = 1), (this.year = 2024), (this.startDayOfWeek = 1), (this.weeks = []);
    }
    ngOnInit() {
      this.generateCalendar();
    }
    generateCalendar() {
      this.weeks = [];
      let n = new Date(this.year, this.month - 1, 1),
        i = new Date(this.year, this.month, 0).getDate(),
        o = n.getDay(),
        s = 1,
        a = (o - this.startDayOfWeek + 7) % 7,
        c = new Date(this.year, this.month - 1, 0).getDate(),
        l = Array.from({ length: a }, (h, g) => c - g).reverse(),
        u = i + a,
        d = u % 7 === 0 ? 0 : 7 - (u % 7),
        f = Array.from({ length: d }, (h, g) => g + 1);
      for (let h = 0; h < 6; h++) {
        let g = [];
        for (let w = 0; w < 7; w++)
          h === 0 && w < a
            ? g.push({ month: this.month === 1 ? 12 : this.month - 1, number: l[w] })
            : s > i
              ? g.push({ month: this.month === 12 ? 1 : this.month + 1, number: f.shift() })
              : (g.push({ month: this.month, number: s }), s++);
        this.weeks.push(g);
      }
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['archangel-calendar']],
      inputs: { month: 'month', year: 'year', startDayOfWeek: 'startDayOfWeek' },
      standalone: !0,
      features: [Q],
      decls: 18,
      vars: 0,
      consts: [
        [1, 'calendar'],
        [1, 'header'],
        [1, 'day'],
        [1, 'weeks'],
        ['class', 'number', 3, 'light'],
        [1, 'number'],
        ['class', 'day', 3, 'disabled'],
        ['class', 'weeks'],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'div', 1)(2, 'div', 2),
          S(3, 'Mon'),
          D(),
          C(4, 'div', 2),
          S(5, 'Tue'),
          D(),
          C(6, 'div', 2),
          S(7, 'Wed'),
          D(),
          C(8, 'div', 2),
          S(9, 'Thu'),
          D(),
          C(10, 'div', 2),
          S(11, 'Fri'),
          D(),
          C(12, 'div', 2),
          S(13, 'Sat'),
          D(),
          C(14, 'div', 2),
          S(15, 'Sun'),
          D()(),
          Et(16, Y0, 3, 0, 'div', 7, bt),
          D()),
          i & 2 && (A(16), It(o.weeks));
      },
      styles: [
        '.calendar[_ngcontent-%COMP%]{display:flex;flex-direction:column}.calendar[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]{display:flex;justify-content:space-around;background-color:var(--background-color);padding:18px 0;border-radius:12px;margin-bottom:10px}@media (max-width: 1380px){.calendar[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{font-size:0}.calendar[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]:first-letter{font-size:13px;font-weight:bolder}}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{flex:1;max-width:calc(14.2857% - 10px);margin:10px;box-sizing:border-box;text-align:center;border:1px solid var(--background-color);font-size:13px;font-weight:bolder;cursor:pointer;background-color:var(--background-color);border-radius:12px;color:var(--text-color)}@media (max-width: 1380px){.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]{line-height:40px;max-width:calc(14.2857% - 2px);margin:2px}}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]:first-child{margin-left:0}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]:last-child{margin-right:0}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]:not(.disabled):hover{background-color:var(--primary-color)}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]   .number[_ngcontent-%COMP%]{font-size:60px;font-weight:400;color:#ffffff40;line-height:92px}.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]   .number.light[_ngcontent-%COMP%]{opacity:.33}@media (max-width: 1380px){.calendar[_ngcontent-%COMP%]   .weeks[_ngcontent-%COMP%]   .day[_ngcontent-%COMP%]   .number[_ngcontent-%COMP%]{line-height:30px;font-size:13px;color:var(--white-color)}}',
      ],
    }));
  let t = e;
  return t;
})();
function Z0(t, e) {
  if (t & 1) {
    let r = or();
    C(0, 'button', 5),
      X('click', function () {
        let o = Xn(r).$implicit,
          s = be();
        return Jn(s.simulateAction(o));
      }),
      S(1, ' Simulate '),
      D();
  }
  if (t & 2) {
    let r = e.$implicit;
    J('color', r.color)('rounded', !0)('border', !0)('loading', r.loading);
  }
}
function K0(t, e) {
  if (t & 1) {
    let r = or();
    C(0, 'button', 5),
      X('click', function () {
        let o = Xn(r).$implicit,
          s = be();
        return Jn(s.simulateAction(o));
      }),
      S(1, ' Simulate '),
      D();
  }
  if (t & 2) {
    let r = e.$implicit;
    J('color', r.color)('rounded', !0)('border', !0)('loading', r.loading);
  }
}
function Q0(t, e) {
  if (t & 1) {
    let r = or();
    C(0, 'button', 6),
      X('click', function () {
        let o = Xn(r).$implicit,
          s = be();
        return Jn(s.simulateAction(o));
      }),
      S(1, ' Simulate '),
      D();
  }
  if (t & 2) {
    let r = e.$implicit;
    J('color', r.color)('small', !0)('rounded', !0)('border', !0)('loading', r.loading);
  }
}
var mm = (() => {
  let e = class e {
    constructor() {
      (this.buttons1 = []), (this.buttons2 = []), (this.buttons3 = []);
      let n = ['primary', 'secondary', 'black'];
      for (let i of n) this.buttons1.push({ color: i, loading: !1 });
      for (let i of n) this.buttons2.push({ color: i, loading: !1 });
      for (let i of n) this.buttons3.push({ color: i, loading: !1 });
    }
    simulateAction(n) {
      n.loading ||
        ((n.loading = !0),
        clearTimeout(n.timeout),
        (n.timeout = setTimeout(() => {
          n.loading = !1;
        }, 3e3)));
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-buttons-demo']],
      standalone: !0,
      features: [Q],
      decls: 13,
      vars: 5,
      consts: [
        [1, 'wrapper'],
        [1, 'mb-3'],
        [1, 'row', 'row-full-width'],
        [1, 'row'],
        ['archangelButton', '', 3, 'color', 'small', 'rounded', 'border', 'disabled'],
        ['archangelButton', '', 3, 'color', 'rounded', 'border', 'loading', 'click'],
        ['archangelButton', '', 3, 'color', 'small', 'rounded', 'border', 'loading', 'click'],
        ['archangelButton', '', 3, 'color', 'rounded', 'border', 'loading'],
        ['archangelButton', '', 3, 'color', 'small', 'rounded', 'border', 'loading'],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'h5', 1),
          S(2, 'Dynamic buttons'),
          D(),
          C(3, 'div', 2),
          Et(4, Z0, 2, 4, 'button', 7, bt),
          D(),
          C(6, 'div', 3),
          Et(7, K0, 2, 4, 'button', 7, bt),
          Et(9, Q0, 2, 5, 'button', 8, bt),
          C(11, 'button', 4),
          S(12, ' Disabled '),
          D()()()),
          i & 2 &&
            (A(4),
            It(o.buttons1),
            A(3),
            It(o.buttons2),
            A(2),
            It(o.buttons3),
            A(2),
            J('color', 'primary')('small', !0)('rounded', !0)('border', !0)('disabled', !0));
      },
      dependencies: [ft],
      styles: [
        '.wrapper[_ngcontent-%COMP%]{background-color:#2a33417d;padding:20px;margin-bottom:40px;border-radius:20px;border:1px solid var(--background-color)}.wrapper[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{border-bottom:1px dashed var(--background-color);padding-bottom:12px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:last-child{margin-bottom:0}@media (min-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row.row-full-width[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:1 1 30%}}@media (max-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:50%}}',
      ],
    }));
  let t = e;
  return t;
})();
function J0(t, e) {
  if ((t & 1 && (C(0, 'p'), S(1), D()), t & 2)) {
    let r = be();
    A(1), ti(' Selected value: ', r.selectedOption1.label, ' (value = ', r.selectedOption1Value, ') ');
  }
}
function eI(t, e) {
  t & 1 && (C(0, 'p'), S(1, 'No option selected...'), D());
}
function tI(t, e) {
  if ((t & 1 && (C(0, 'p'), S(1), D()), t & 2)) {
    let r = be();
    A(1), ti(' Selected value: ', r.selectedOption2 == null ? null : r.selectedOption2.label, ' (value = ', r.selectedOption2Value, ') ');
  }
}
function nI(t, e) {
  t & 1 && (C(0, 'p'), S(1, 'No option selected...'), D());
}
function rI(t, e) {
  if ((t & 1 && (C(0, 'p'), S(1), D()), t & 2)) {
    let r = be();
    A(1), ti(' Selected value: ', r.selectedOption3 == null ? null : r.selectedOption3.label, ' (value = ', r.selectedOption3Value, ') ');
  }
}
function iI(t, e) {
  t & 1 && (C(0, 'p'), S(1, 'No option selected...'), D());
}
var vm = (() => {
  let e = class e {
    constructor(n, i) {
      (this.fb = n),
        (this.notificationService = i),
        (this.options1 = [
          { label: 'BMW', value: 1 },
          { label: 'Audi', value: 2 },
          { label: 'Porsche', value: 3 },
          { label: 'Ferrari', value: 4 },
          { label: 'Toyota', value: 5 },
        ]),
        (this.options2 = [
          { label: 'Red', value: 1 },
          { label: 'Blue', value: 2 },
          { label: 'Green', value: 3 },
          { label: 'Yellow', value: 4 },
          { label: 'Purple', value: 5 },
        ]),
        (this.options3 = [
          { label: 'Yes', value: !0 },
          { label: 'No', value: !1 },
          { label: 'Disabled', value: !1, disabled: !0 },
        ]),
        (this.form = this.fb.group({ selection: [''] }));
    }
    ngOnInit() {
      this.form.controls.selection.valueChanges.subscribe((n) => {
        (this.selectedOption3Value = !!n), (this.selectedOption3 = this.options3.find((i) => i.value === this.selectedOption3Value));
      });
    }
    onSelectOption1() {
      this.selectedOption1 = this.options1.find((n) => n.value === this.selectedOption1Value);
    }
    onSelectOption2(n) {
      (this.selectedOption2Value = n), (this.selectedOption2 = this.options2.find((i) => i.value === n));
    }
    shuffleOptions() {
      (this.options1 = this.shuffle(this.options1)),
        (this.options2 = this.shuffle(this.options2)),
        this.notificationService.show(
          'Options have been successfully shuffled. This goes to demonstrate that all options in the array can be modified/changed and update in real time!',
        );
    }
    shuffle(n) {
      let i = n.slice();
      for (let o = i.length - 1; o > 0; o--) {
        let s = Math.floor(Math.random() * (o + 1));
        [i[o], i[s]] = [i[s], i[o]];
      }
      return i;
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(zg), v(Ut));
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-selects-demo']],
      standalone: !0,
      features: [Ne([Ut]), Q],
      decls: 25,
      vars: 14,
      consts: [
        [1, 'wrapper'],
        [1, 'header', 'mb-3'],
        ['archangelButton', '', 'color', 'primary', 3, 'small', 'rounded', 'border', 'click'],
        [1, 'row'],
        [1, 'select'],
        [1, 'form-label'],
        [
          'valueField',
          'value',
          'nameField',
          'label',
          'placeholder',
          'Select an option...',
          'searchPlaceholder',
          'Search for an option...',
          1,
          'mb-2',
          3,
          'options',
          'ngModel',
          'hasSearch',
          'ngModelChange',
        ],
        [
          'valueField',
          'value',
          'nameField',
          'label',
          'placeholder',
          'Select an option...',
          'searchPlaceholder',
          'Search for an option...',
          1,
          'mb-2',
          3,
          'options',
          'hasSearch',
          'onOptionSelect',
        ],
        [1, 'select', 3, 'formGroup'],
        [
          'valueField',
          'value',
          'nameField',
          'label',
          'formControlName',
          'selection',
          'placeholder',
          'Select an option...',
          1,
          'mb-2',
          3,
          'options',
          'hasSearch',
        ],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'div', 1)(2, 'h5'),
          S(3, 'Select dropdown'),
          D(),
          C(4, 'button', 2),
          X('click', function () {
            return o.shuffleOptions();
          }),
          S(5, ' Shuffle '),
          D()(),
          C(6, 'div', 3)(7, 'div', 4)(8, 'span', 5),
          S(9, 'Select a value:'),
          D(),
          C(10, 'archangel-select', 6),
          X('ngModelChange', function (a) {
            return (o.selectedOption1Value = a);
          })('ngModelChange', function () {
            return o.onSelectOption1();
          }),
          D(),
          Te(11, J0, 2, 2, 'p')(12, eI, 2, 0),
          D(),
          C(13, 'div', 4)(14, 'span', 5),
          S(15, 'Select a value:'),
          D(),
          C(16, 'archangel-select', 7),
          X('onOptionSelect', function (a) {
            return o.onSelectOption2(a);
          }),
          D(),
          Te(17, tI, 2, 2, 'p')(18, nI, 2, 0),
          D(),
          C(19, 'form', 8)(20, 'span', 5),
          S(21, 'Select a value:'),
          D(),
          we(22, 'archangel-select', 9),
          Te(23, rI, 2, 2, 'p')(24, iI, 2, 0),
          D()()()),
          i & 2 &&
            (A(4),
            J('small', !0)('rounded', !0)('border', !0),
            A(6),
            J('options', o.options1)('ngModel', o.selectedOption1Value)('hasSearch', !0),
            A(1),
            Vt(11, o.selectedOption1 && o.selectedOption1Value ? 11 : 12),
            A(5),
            J('options', o.options2)('hasSearch', !0),
            A(1),
            Vt(17, o.selectedOption2 && o.selectedOption2Value ? 17 : 18),
            A(2),
            J('formGroup', o.form),
            A(3),
            J('options', o.options3)('hasSearch', !1),
            A(1),
            Vt(23, o.selectedOption3 !== void 0 && o.selectedOption3Value !== void 0 ? 23 : 24));
      },
      dependencies: [Vs, $g, Ps, Pg, Si, js, vu, yu, am, ft],
      styles: [
        '.wrapper[_ngcontent-%COMP%]{background-color:#2a33417d;padding:20px;margin-bottom:40px;border-radius:20px;border:1px solid var(--background-color)}.wrapper[_ngcontent-%COMP%]   .header[_ngcontent-%COMP%]{display:flex;gap:20px;align-items:center;border-bottom:1px dashed var(--background-color);padding-bottom:12px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;gap:20px;margin-bottom:20px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:last-child{margin-bottom:0}@media (max-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{flex-direction:column}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .select[_ngcontent-%COMP%]{margin-bottom:20px}}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   .select[_ngcontent-%COMP%]{flex:1}',
      ],
    }));
  let t = e;
  return t;
})();
var ym = (() => {
  let e = class e {
    constructor(n, i) {
      (this.confirmationService = n), (this.notificationService = i);
    }
    openConfirmation() {
      this.confirmationService
        .show('This is a sample confirmation - do you agree?', 'Agree', 'Cancel')
        .componentInstance?.dialogRef.closed.pipe(me(1))
        .subscribe((i) => {
          this.notificationService.show(`You did ${i ? 'indeed' : 'not'} agree...`);
        });
    }
    openNotification() {
      this.notificationService.show('This is a sample notification you can display...');
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)(v(Zs), v(Ut));
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-dialogs-demo']],
      standalone: !0,
      features: [Ne([Zs, Ut]), Q],
      decls: 8,
      vars: 4,
      consts: [
        [1, 'wrapper'],
        [1, 'mb-3'],
        [1, 'row'],
        ['archangelButton', '', 'color', 'black', 3, 'small', 'rounded', 'click'],
      ],
      template: function (i, o) {
        i & 1 &&
          (C(0, 'div', 0)(1, 'h5', 1),
          S(2, 'Dialogs'),
          D(),
          C(3, 'div', 2)(4, 'button', 3),
          X('click', function () {
            return o.openConfirmation();
          }),
          S(5, ' Request confirmation '),
          D(),
          C(6, 'button', 3),
          X('click', function () {
            return o.openNotification();
          }),
          S(7, ' Show a notification '),
          D()()()),
          i & 2 && (A(4), J('small', !0)('rounded', !0), A(2), J('small', !0)('rounded', !0));
      },
      dependencies: [ft],
      styles: [
        '.wrapper[_ngcontent-%COMP%]{background-color:#2a33417d;padding:20px;margin-bottom:40px;border-radius:20px;border:1px solid var(--background-color)}.wrapper[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{border-bottom:1px dashed var(--background-color);padding-bottom:12px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;gap:12px;margin-bottom:20px}@media (max-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{flex-direction:column}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{width:100%}}',
      ],
    }));
  let t = e;
  return t;
})();
var _m = (() => {
  let e = class e {
    constructor() {
      (this.month = new Date().getMonth() + 1), (this.year = new Date().getFullYear());
    }
  };
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-calendar-demo']],
      standalone: !0,
      features: [Q],
      decls: 4,
      vars: 3,
      consts: [
        [1, 'wrapper'],
        [1, 'mb-3'],
        [3, 'month', 'year', 'startDayOfWeek'],
      ],
      template: function (i, o) {
        i & 1 && (C(0, 'div', 0)(1, 'h5', 1), S(2, 'Calendar'), D(), we(3, 'archangel-calendar', 2), D()),
          i & 2 && (A(3), J('month', o.month)('year', o.year)('startDayOfWeek', 1));
      },
      dependencies: [gm],
      styles: [
        '.wrapper[_ngcontent-%COMP%]{background-color:#2a33417d;padding:20px;margin-bottom:40px;border-radius:20px;border:1px solid var(--background-color)}.wrapper[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%]{border-bottom:1px dashed var(--background-color);padding-bottom:12px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]{display:flex;flex-wrap:wrap;gap:20px;margin-bottom:20px}.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]:last-child{margin-bottom:0}@media (min-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row.row-full-width[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:1 1 30%}}@media (max-width: 1380px){.wrapper[_ngcontent-%COMP%]   .row[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{flex:50%}}',
      ],
    }));
  let t = e;
  return t;
})();
var Dm = (() => {
  let e = class e {};
  (e.ɵfac = function (i) {
    return new (i || e)();
  }),
    (e.ɵcmp = K({
      type: e,
      selectors: [['app-root']],
      standalone: !0,
      features: [Q],
      decls: 6,
      vars: 0,
      consts: [[1, 'container', 'pb-5']],
      template: function (i, o) {
        i & 1 &&
          (we(0, 'app-header'),
          C(1, 'div', 0),
          we(2, 'app-buttons-demo')(3, 'app-selects-demo')(4, 'app-dialogs-demo')(5, 'app-calendar-demo'),
          D());
      },
      dependencies: [fl, pg, mm, vm, ym, _m],
    }));
  let t = e;
  return t;
})();
Ap(Dm, hg).catch((t) => console.error(t));