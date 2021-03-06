class Api::TreatsController < ApplicationController
  def index
    @city = City.find_by(name: params[:city])

    if @city

      @treats = @city.treats

      @shops = params[:bounds] ? Shop.in_bounds(bounds) : @city.shops
      shop_ids = @shops.map { |s| s.id }

      @treats = @treats.select { |treat| shop_ids.include?(treat.shop_id) }

      render :index
    else
      render json: ['No treats found'], status: 200
    end
  end

  def search
    @city = City.find_by(name: params[:city])
    if @city
      all_treats = @city.treats.includes(:shop)
      all_shops = params[:bounds] ? Shop.in_bounds(bounds) : @city.shops
      
      shop_ids = all_shops.map { |s| s.id }

      all_treats = all_treats.select { |treat| shop_ids.include?(treat.shop_id) }

      @shops = []
      @treats = []

      all_treats.each do |treat|
        if treat.name.downcase.include?(params[:search].downcase)

          @treats << treat
          @shops << treat.shop
        end
        if treat.shop.name.downcase.include?(params[:search].downcase)
          @treats << treat
          @shops << treat.shop
        end
      end

      if @treats.empty?
        render json: ['No treats found'], status: 200
      else
        render :search
      end

    else
      render json: ['No city found'], status: 200
    end
  end

  private

  def bounds
    JSON.parse(params[:bounds])
  end

end
