import {Injectable} from '@angular/core';
import {SwPush} from "@angular/service-worker";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  readonly publicKey = "BHoUJFeCnDNWy4KMPCrRFvFhCC9KAiKqKolUMUBiydQDWxLMyq9kRRuQ_EqGdmT0Z5gePu7QSaha9UjSyEZ-2f0";
  constructor(private  swPush:SwPush, private http: HttpClient) {

  }
  public offerNotification() {
    this.swPush.requestSubscription({
      serverPublicKey: this.publicKey
    }).then( (sub: PushSubscription) =>{
      console.log({ sub });
      this.http.post('/api/notifications', sub).subscribe( () => {
        console.log('sub ok');
      }, (err) => {
        console.log('sub fail');
      });
    }).catch( () => {
      console.log('error')
    })
  }
}
