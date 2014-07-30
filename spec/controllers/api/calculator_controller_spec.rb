require 'rails_helper'

RSpec.describe Api::CalculatorController do
  context 'For User Signed in' do
  let(:user) do
    User.create({:email =>'dhansiddh@gmail.com',:password => '12345678'})
  end
  before(:each) do
    sign_in user
  end
  context '#create' do
    it 'should create the calculator' do
      post :create
      expect(response.status).to eq(201)
      expect(Calculator.count).to eq(1)
    end
    it 'should get the existing calculator' do
      Calculator.create({:state=>0,:user_id =>user.id})
      post :create
      expect(response.status).to eq(200)
      expect(Calculator.count).to eq(1)
    end
  end
  context'#calculate' do
    it 'should throw error when calculator is not created for the user' do
      put :calculate, :command => "add 5"
      expect(response.status).to eq(404)
    end

    it 'should do addition' do
      Calculator.create({:state=>0,:user_id =>user.id})
      put :calculate, :command => "add 5"
      expect(response.body).to eq({:state=>5.0}.to_json)
    end
  end
  end
  context 'User not signed in' do

    it 'should return 401 when user is not logged in' do
      put :create,{:format => :json}
      expect(response.status).to eq(401)
    end
  end
  end