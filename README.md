# site-interface-mobile-client



   images.map(async (val) => {
        try {
          let resp = await this.props.uploadSingleImage(val, images);
          console.log('ress', resp)
          console.log('val', val);
          if (resp.message === 'Saved Successfully.') {
            let a = this.filterImages(val, images);
            console.log('a', a.length);
            await this.props.addNewImage(a);
          }
        }
        catch (err) {
          console.log('err', err.message);
        }
      });